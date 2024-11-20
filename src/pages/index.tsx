import { motion } from 'framer-motion';
import { NextPage } from 'next';
import Head from 'next/head';
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
    description: 'Describe each person with fun adjectives'
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

const LandingPage: NextPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Head>
        <title>GiftWhisper - Magical Gift Exchange</title>
        <meta name="description" content="Create magical gift exchanges with GiftWhisper" />
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
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl mb-6 text-red-400 font-christmas tracking-wide"
          >
            GiftWhisper
          </motion.h1>
          <p className="text-2xl text-green-300 mb-8">
            Make your gift exchange magical! ✨
          </p>
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
            <Link 
              href="/participants" 
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
                <motion.span
                  animate={{ rotate: [0, 14, -8, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="text-lg"
                >
                  🎁
                </motion.span>
              </motion.span>
              <div className="
                absolute inset-0 
                bg-gradient-to-br from-red-500 via-red-600 to-red-700
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300 ease-out
                rounded-full
              "/>
              <div className="
                absolute -inset-1
                bg-gradient-to-br from-red-400 via-white/20 to-red-400
                blur-[2px] opacity-30
                group-hover:opacity-50 group-hover:blur-[3px]
                transition-all duration-300 ease-out
                -z-10
                rounded-full
              "/>
            </Link>
          </motion.div>
        </motion.div>
        </motion.div>

        {/* Features section */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="text-4xl mb-4"
              >
                {feature.emoji}
              </motion.div>
              <h3 className="text-xl font-semibold text-green-400 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
