import type { NextPage, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { AssignmentContent } from "~/components/AssignmentContent";
import { GameLayout } from "~/components/GameLayout";
import { useAssignment } from "~/hooks/useAssignment";

const AssignmentPage: NextPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { id } = router.query;

  const {
    pin,
    error,
    isVerified,
    showPin,
    isRevealed,
    assignment,
    isLoading,
    setPin,
    handlePinSubmit,
    handleReveal,
    togglePinVisibility,
  } = useAssignment(id as string);

  if (isLoading) {
    return (
      <GameLayout disableNavigation>
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg bg-white/5 p-6 text-center backdrop-blur-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
            <p className="text-gray-400">Loading...</p>
            <p className="mt-2 text-gray-400">
              Please wait while we load the assignment.
            </p>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (!assignment) {
    return (
      <GameLayout disableNavigation>
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg bg-red-500/10 p-6 text-center backdrop-blur-sm">
            <h1 className="mb-4 text-2xl font-bold text-red-400">Error</h1>
            <p className="text-red-300">Assignment not found.</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout disableNavigation>
      <div className="flex min-h-screen items-center justify-center p-4">
        {assignment && (
          <AssignmentContent
            assignment={assignment}
            isVerified={isVerified}
            isRevealed={isRevealed}
            pin={pin}
            error={error}
            showPin={showPin}
            handlePinSubmit={handlePinSubmit}
            handleReveal={handleReveal}
            setPin={setPin}
            togglePinVisibility={togglePinVisibility}
            isLoading={isLoading}
          />
        )}
      </div>
    </GameLayout>
  );
};

export const getStaticProps = async ({ locale = "en" }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["game", "common"])),
    },
  };
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default AssignmentPage;
