import { View, Text, Pressable } from "react-native"
import { useNavigate } from "react-router-native";

const AppBarTab = ({ to, item, styles, onPress}) => {
  const navigate = useNavigate();
  return (
    <View style={styles.box} >
      <Pressable onPress={() => {
          if (onPress) onPress();
          navigate(`/${to}`);
        }}
      >
        <Text style={styles.text}>{item}</Text>
      </Pressable>
    </View>
  )
};

export default AppBarTab;