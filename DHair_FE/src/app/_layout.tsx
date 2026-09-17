// src/app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../../global.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        {/* Chỉ định (tabs) là luồng chính, ẩn header mặc định */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}