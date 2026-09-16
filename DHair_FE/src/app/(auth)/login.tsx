import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert(
        "Thông báo",
        "Vui lòng nhập đầy đủ email và mật khẩu"
      );
      return;
    }

    if (email === "admin@gmail.com" && password === "123456") {
      Alert.alert("Thông báo", "Đăng nhập thành công");
    } else {
      Alert.alert("Thông báo", "Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>D</Text>
        </View>

        {/* Tiêu đề */}
        <Text style={styles.title}>Đăng nhập</Text>

        <Text style={styles.subtitle}>
          Chào mừng bạn quay trở lại DHair
        </Text>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Mật khẩu */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu</Text>

          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Quên mật khẩu */}
        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>

        {/* Đăng nhập */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>
            ĐĂNG NHẬP
          </Text>
        </TouchableOpacity>

        {/* Đăng ký */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Chưa có tài khoản?
          </Text>

          <TouchableOpacity>
            <Text style={styles.registerButton}>
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#153B75",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "bold",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#153B75",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#777777",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 35,
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    backgroundColor: "#FAFAFA",
  },

  forgotButton: {
    alignItems: "flex-end",
    marginBottom: 25,
  },

  forgotText: {
    color: "#153B75",
    fontSize: 14,
    fontWeight: "600",
  },

  loginButton: {
    height: 52,
    backgroundColor: "#153B75",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  registerText: {
    color: "#777777",
    fontSize: 14,
  },

  registerButton: {
    color: "#153B75",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
});