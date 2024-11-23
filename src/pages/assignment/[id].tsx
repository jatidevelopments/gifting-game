import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { useAssignment } from '~/hooks/useAssignment';

const AssignmentPage: NextPage = (props) => {
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-white/5 backdrop-blur-sm rounded-lg text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">🎄 The elves are preparing your assignment...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-red-500/10 backdrop-blur-sm rounded-lg text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Ho ho... Oh no! 🎅</h1>
          <p className="text-red-300">Santa couldn&apos;t find your assignment in his list</p>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-4xl mb-4"
              >
                🎁
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Ho Ho Ho, {assignment.gifter.name}! 🎅
              </h1>
              <p className="text-gray-400">
                {assignment.gifter.hasAccessed
                  ? 'Enter your magical PIN to peek at your Secret Santa assignment!'
                  : 'Create a magical PIN to protect your Secret Santa surprise!'}
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div>
                <label htmlFor="pin" className="sr-only">
                  PIN
                </label>
                <div className="relative">
                  <input
                    id="pin"
                    name="pin"
                    type={showPin ? 'text' : 'password'}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/50 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter PIN (4-8 characters)"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={togglePinVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPin ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3">
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors transform hover:scale-105 active:scale-95 font-medium"
              >
                {assignment.gifter.hasAccessed ? '✨ Unlock the Magic' : '🎄 Set Festive PIN'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Your Gift Assignment | MySecretSanta</title>
      </Head>
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-4xl mb-4"
              >
                🎁
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Ho Ho Ho, {assignment.gifter.name}! 🎅
              </h1>
              <p className="text-gray-400">
                {!isRevealed ? "Ready to discover your Secret Santa mission?" : "Here's your festive assignment!"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!isRevealed ? (
                <motion.div
                  key="reveal-button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <button
                    onClick={handleReveal}
                    className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors transform hover:scale-105 active:scale-95"
                  >
                    🎁 Unwrap Your Assignment
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="assignment-details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
                    <p className="text-gray-400 mb-2">Your Secret Santa mission is to spread joy to:</p>
                    <h2 className="text-2xl font-bold text-green-400">
                      {assignment.receiver.name} 🎄
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      ✨ Magic Words to Guide Your Gift:
                    </h3>
                    <div className="grid gap-3">
                      {[
                        assignment.adjective1,
                        assignment.adjective2,
                        assignment.adjective3,
                      ].map((adj, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">
                              {index === 0 ? '🎯' : index === 1 ? '💝' : '✨'}
                            </span>
                            <span className="text-white">{adj.word}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {assignment.giftIdeaImages && assignment.giftIdeaImages.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">
                        AI-Generated Gift Ideas:
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {assignment.giftIdeaImages.map((imageUrl, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.2 }}
                            className="relative aspect-square rounded-lg overflow-hidden border border-white/10"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imageUrl}
                              alt={`Gift idea ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-400 text-center mt-2">
                        🎨 Santa&apos;s elves crafted these magical gift ideas just for you!
                      </p>
                    </div>
                  )}

                  <div className="pt-6 text-center">
                    <p className="text-sm text-gray-400">
                      Shhh... Keep the holiday magic alive! 🤫 ✨
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AssignmentPage;