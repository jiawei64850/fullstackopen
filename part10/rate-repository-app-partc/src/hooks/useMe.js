import { IS_SIGNIN } from '../graphql/queries';
import { useQuery } from "@apollo/client";

const useMe = () => {
  const { data, error, loading, refetch }  = useQuery(IS_SIGNIN, {
    fetchPolicy: 'network-only',
  })
  
  return { data, loading, refetch };
};

export default useMe;