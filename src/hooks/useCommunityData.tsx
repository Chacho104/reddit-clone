import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "../atoms/communitiesAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import {
  collection,
  doc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getMySnippets = async () => {
    setLoading(true);
    try {
      // get user's snippets
      const snippetsDoc = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetsDoc.docs.map((doc) => ({ ...doc.data() }));

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));

      console.log("user community snippets", snippets);
    } catch (error: any) {
      console.log("getMySnippetsError", error);
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    getMySnippets();
  }, [user]);

  const joinCommunity = async (communityData: Community) => {
    setLoading(true);
    // batch write

    try {
      // create a new community snippet for user
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
      };

      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      // uopdate numberOfMembers in joined community [+1]
      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      // update recoil state on client => communityState.mySnippet
      setCommunityStateValue((prev) => ({
        ...prev,
        // append newSnippet to end of existing array
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log("joinCommunity error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    setLoading(true);
    // batch write

    try {
      // delete the community snippet from user
      const batch = writeBatch(firestore);

      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );

      // uopdate numberOfMembers in left community [-1]

      batch.update(doc(firestore, "communities", communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();
    } catch (error: any) {
      console.log("leaveCommunity error", error);
      setError(error.message);
    }
    // update recoil state => communityState.mySnippet

    setCommunityStateValue((prev) => ({
      ...prev,
      mySnippets: prev.mySnippets.filter(
        (item) => item.communityId !== communityId
      ),
    }));
    setLoading(false);
  };

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // is the user signed in?
    // if not => open auth modal

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }

    joinCommunity(communityData);
  };

  return {
    // data and functions that is accessible by other components that use this hook
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  };
};
export default useCommunityData;