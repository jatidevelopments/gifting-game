import { motion } from 'framer-motion';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { api } from "~/utils/api";
import { Logo } from '~/components/Logo';

import Link from 'next/link';

const features = [
  {
    emoji: '🎁',
    title: 'Create Your Exchange',
    description: 'Start by adding your festive group of gift-givers'
  },
  {
    emoji: '✨',
    title: 'Add Magic Words',
    description: 'Describe each person with fun magic words'
  },
  {
    emoji: '🎯',
    title: 'Perfect Matches',
    description: 'We\'ll create the perfect gift-giving pairs'
  },
  {
    emoji: '🔒',
    title: 'Keep it Secret',
    description: 'Each person gets their own private link'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const LandingPage: NextPage = (props) => {
  const router = useRouter();
  const createGameRoom = api.gameRoom.create.useMutation({
    onSuccess: (data: any) => {
      void router.push(`/game/${data.id}/participants`);
    },
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Head>
        <title>MySecretSanta - Secret Santa Gift Exchange</title>
        <meta name="description" content="Create fun and easy Secret Santa gift exchanges with MySecretSanta" />
      </Head>

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 pt-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-4"
          >
            <Logo href="/" size="large" layout="vertical" showImage={false} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="text-2xl text-green-300 mb-12">
              <span>✨</span>
              <span className="mx-2">Make your gift exchange magical!</span>
              <span>✨</span>
            </p>
          </motion.div>
          {/* Get Started Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button 
                onClick={() => createGameRoom.mutate()}
                className="
                  relative inline-flex items-center justify-center
                  bg-gradient-to-br from-red-600 via-red-700 to-red-800
                  text-white text-xl px-8 py-3 rounded-full
                  transition-all duration-300 ease-out
                  shadow-[0_0_15px_rgba(220,38,38,0.3)]
                  hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]
                  font-semibold
                  overflow-hidden
                  group
                "
              >
                <motion.span 
                  className="relative z-10 flex items-center gap-2"
                  whileHover={{ x: [0, 4, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  Start Your Exchange
                  <span className="text-2xl">→</span>
                </motion.span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features section */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 mt-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
