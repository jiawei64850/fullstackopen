import { View, TextInput, Pressable, StyleSheet } from "react-native";
import Text from "./Text";
import theme from "../theme";
import { useFormik } from "formik";
import * as yup from 'yup';
import useSignIn from "../hooks/useSignIn";
import { useNavigate } from "react-router-native";
import useAuthStorage from "../hooks/useAuthStorage";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey'
  },
  box: {
    backgroundColor: 'white',
    padding: 5
  },
  inputbox: {
    color: '#666',
    borderStyle: 'solid',
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginVertical: 7,
    marginHorizontal: 10,
    textAlign: 'left',
    borderWidth: 1,
    borderColor: 'grey',
    height: 40
  },
  pressable: {
    backgroundColor: theme.colors.primary,
    borderStyle: 'solid',
    marginVertical: 7,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 40
  },
  pressableText: {
    color: 'white',
    textAlign: 'center',
  },
});




const SignIn = () => {
  const navigate = useNavigate();
  const validationSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });
  
  const initialValues = {
    username: '',
    password: '',
  }
  
  const [signIn] = useSignIn();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      const { data } = await signIn({ username, password });
      console.log(data);
      navigate("/repositories")
    } catch (e) {
      console.log(e);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  

  

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <TextInput 
          style={formik.touched.username && formik.errors.username ? [styles.inputbox, { borderColor: '#d73a4a' }]: styles.inputbox}
          placeholder="Username"
          value={formik.values.username}
          onChangeText={formik.handleChange('username')}
        />
        {formik.touched.username && formik.errors.username && (
        <Text style={{ color: '#d73a4a', paddingHorizontal: 10  }}>{formik.errors.username}</Text>
      )}
        <TextInput 
          style={formik.touched.password && formik.errors.password ? [styles.inputbox, { borderColor: '#d73a4a' }]: styles.inputbox}
          placeholder="Password"
          value={formik.values.password}
          onChangeText={formik.handleChange('password')}
          secureTextEntry={true} 
        />
        {formik.touched.password && formik.errors.password && (
        <Text style={{ color: '#d73a4a', paddingHorizontal: 10 }}>{formik.errors.password}</Text>
      )}
        <Pressable onPress={formik.handleSubmit} style={styles.pressable}>
          <Text fontWeight="bold" style={styles.pressableText}>Sign in</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignIn;