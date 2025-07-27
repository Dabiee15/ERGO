import { authAdmin } from "./dbadmin"; 

export async function updateOnboardingStage(uid: string, updates: Partial<{
  connectAccount: boolean;
  importFile: boolean;
  updateProfile: boolean;
}>) {
  const userRef = authAdmin.firestore.collection("users").doc(uid);

  await userRef.set(
    {
      onboarding: {
        ...updates,
      }
    },
    { merge: true }
  );

  // Fetch current onboarding data
  const userSnap = await userRef.get();
  const onboarding = userSnap.data()?.onboarding || {};

  const allComplete =
    onboarding.connectAccount &&
    onboarding.importFile;

  if (allComplete && !onboarding.completed) {
    await userRef.update({
      "onboarding.completed": true,
    });
  }
}
