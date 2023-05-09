import { Button, Flex, Image } from "@chakra-ui/react";
import React from "react";

const OAuthButtons: React.FC = () => {
  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button variant="oauth" mb={2}>
        <Image src="/images/googlelogo.png" height="18px" mr={6} />
        Continue with Google
      </Button>
      <Button variant="oauth">
        <Image src="/images/applelogo.svg" height="22px" mr={6} />
        Continue with Apple
      </Button>
    </Flex>
  );
};
export default OAuthButtons;
