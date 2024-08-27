import { FlatList, View, StyleSheet } from 'react-native';
import RepositoryItem from './RepositoryItem';
import Text from './Text';
import theme from '../theme';
import useRepositories from '../hooks/useRepositories';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  container: {
    backgroundColor: 'lightgrey'
  },
  item: {
    flex: 1,
    backgroundColor: 'white',
    padding: 5,
  },
  languageBox: {
    backgroundColor: theme.colors.primary,
    color: 'white',
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  basicBox: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  nestedBasicBox: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: 7,
    marginHorizontal: 5 
  },
  detailsBox: {
    flexDirection: 'row',
    justifyContent: "space-around",
    marginVertical: 7,
    paddingVertical: 7
  },
  nestedDetailsBox: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'stretch',
    flex: 1,
  },
  fullName: {
    marginVertical: 5,
    flexShrink: 1,   
    flexWrap: 'wrap', 
  },
  description: { 
    color: '#666',
    marginRight: 40,
    paddingRight: 40,
    marginVertical: 7,
    flexShrink: 1,  
    flexWrap: 'wrap',
  },
  avatar: {
    width: 30, 
    height: 30,
    alignItems: 'center',
    marginTop: 7
  },
  statNumber: {
    textAlign: 'center'
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center'
  },
});




const RepositoryList = () => {
  const { data, loading, error } = useRepositories();
  
  
  if (loading)
    return <Text>...loading</Text>

  if (error) {
    console.error(error);
    return { data: null, loading: false };
  }
  console.log(data);
  
  
  const repositoryNodes = data
    ? data.repositories.edges.map(edge => edge.node)
    : [];

  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={item => item.id}
      renderItem={({item}) => <RepositoryItem {...item} styles={styles}/>}
      style={styles.container}
    />
  );
};

export default RepositoryList;