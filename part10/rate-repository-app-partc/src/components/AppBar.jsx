import { View, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import AppBarTab from './AppBarTab';
import useMe from '../hooks/useMe';
import useAuthStorage from '../hooks/useAuthStorage';
import { useApolloClient } from '@apollo/client';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    display: 'flex',
    flexDirection: 'row', // Lays out children in a column
    justifyContent: 'space-between', // Distributes space around items
    alignItems: 'center',   // Centers items vertically
    backgroundColor: '#24292e',
  },
  box: {
    flexGrow: 1,
    flexShrink: 1,
    margin: 20,
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
  }
  // ...
});


const AppBar = () => {
  const { data, loading, refetch }  = useMe();

  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signOut = async () => {
    try {
      if (data?.me) {
        await authStorage.removeAccessToken();
        await apolloClient.resetStore();
        await refetch();
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <AppBarTab to={'repositories'} item={'Repositories'} onPress={() => console.log('Repositories')} styles={styles}/>
        <AppBarTab to={'signin'} item={'Sign in'} onPress={() => console.log('Sign in')} styles={styles}/>
        {data?.me && 
        <AppBarTab 
          to={'signout'} 
          item={'Sign out'} 
          onPress={async () => await signOut()} 
          styles={styles}
        />}      
      </ScrollView>
    </View>
  );
};

export default AppBar;