import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  DirectoryMenuItem,
  directoryMenuState,
} from "../atoms/directoryMenuAtom";
import { useRouter } from "next/router";
import { communityState } from "../atoms/communitiesAtom";
import { FaReddit } from "react-icons/fa";

const useDirectory = () => {
  const router = useRouter();
  const communityStateValue = useRecoilValue(communityState);

  const [directoryState, setDirectoryState] =
    useRecoilState(directoryMenuState);

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({ ...prev, selectedMenuItem: menuItem }));
    router.push(menuItem.link);

    if (directoryState.isOpen) {
      toggleMenuOpen();
    }
  };

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({ ...prev, isOpen: !directoryState.isOpen }));
  };

  useEffect(() => {
    const { currentCommunity } = communityStateValue;

    if (currentCommunity) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${currentCommunity.id}`,
          link: `/r/${currentCommunity.id}`,
          imageURL: currentCommunity.imageURL,
          icon: FaReddit,
          iconColor: "blue.500",
        },
      }));
    }
  }, [communityStateValue.currentCommunity]);

  return { directoryState, onSelectMenuItem, toggleMenuOpen };
};
export default useDirectory;
