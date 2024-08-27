import { AUTHENTICATE } from "../graphql/mutations";
import { useMutation } from "@apollo/client";
import useAuthStorage from "./useAuthStorage";
import { useApolloClient } from "@apollo/client";

const useSignIn = () => {
  const [mutate, result] = useMutation(AUTHENTICATE);
  
  const authStorage = useAuthStorage();
  
  const apolloClient = useApolloClient();

  const signIn = async ({ username, password }) => {
    // call the mutate function here with the right arguments
    const { data } = await mutate({
      variables: {
        credentials: {
          username,
          password,
        },
      },
    });
    console.log(data.authenticate.accessToken);
    
    await authStorage.setAccessToken(data.authenticate.accessToken);
    apolloClient.resetStore();
    return { data };
  };
  
  return [signIn, result];
};

export default useSignIn;