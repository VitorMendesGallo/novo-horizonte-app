import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      animation: 'fade',
      orientation: 'portrait',
    }}>

      <Stack.Screen name="index.tsx" />
      <Stack.Screen name="loginAdm" />
      <Stack.Screen name="forms-aluno" />
      <Stack.Screen name="forms-materno" />
      <Stack.Screen name="forms-paterno" />
      <Stack.Screen name="forms-obs" />
      <Stack.Screen name="students" />
      <Stack.Screen name="aboutUs" />
      <Stack.Screen name="aboutDevs" />
    </Stack>
  );
}

