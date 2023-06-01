import { Button, Flex, Image } from "@chakra-ui/react";
import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useSignInWithApple } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, googleUser, googleSignInLoading, googleUserError] =
    useSignInWithGoogle(auth);
  const [signInWithApple, appleUser, appleSingInoading, appleUserError] =
    useSignInWithApple(auth);
  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        variant="oauth"
        mb={2}
        isLoading={googleSignInLoading}
        onClick={() => signInWithGoogle()}
      >
        <Image src="/images/googlelogo.png" height="18px" mr={6} />
        Continue with Google
      </Button>
      <Button
        variant="oauth"
        isLoading={appleSingInoading}
        onClick={() => signInWithApple()}
      >
        <Image src="/images/applelogo.svg" height="22px" mr={6} />
        Continue with Apple
      </Button>
    </Flex>
  );
};
export default OAuthButtons;
