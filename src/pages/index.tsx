import { motion } from 'framer-motion';
import Link from 'next/link';
import { Snow } from '../components/Snow';
import type { NextPage } from 'next';

const LandingPage: NextPage = (props) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Snow />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl mb-4 text-red-400 font-christmas">The Gifting Game</h1>
          <p className="text-2xl text-green-300">A festive way to organize your gift exchange!</p>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8"
        >
          <h2 className="text-4xl mb-6 text-red-400 font-christmas">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2 text-green-300 font-christmas">1</div>
              <h3 className="text-xl mb-2 font-semibold">Add Participants</h3>
              <p className="text-gray-200">Enter the names of everyone joining the gift exchange</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 text-green-300 font-christmas">2</div>
              <h3 className="text-xl mb-2 font-semibold">Set Adjectives</h3>
              <p className="text-gray-200">Add fun descriptive words to make gift-giving more exciting</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 text-green-300 font-christmas">3</div>
              <h3 className="text-xl mb-2 font-semibold">Generate Results</h3>
              <p className="text-gray-200">Get unique gift assignments with creative descriptions</p>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8"
        >
          <h2 className="text-4xl mb-6 text-red-400 font-christmas">Features</h2>
          <ul className="list-disc list-inside space-y-3 text-lg">
            <li>Random gift assignment ensuring no one gets themselves</li>
            <li>Fun adjectives to inspire creative gift choices</li>
            <li>Festive animations and interactive elements</li>
            <li>Easy to use interface for all ages</li>
            <li>Instant results generation</li>
          </ul>
        </motion.div>

        {/* Get Started Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Link 
            href="/participants" 
            className="inline-block bg-red-500 hover:bg-red-600 text-white text-2xl px-8 py-4 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
          >
            Get Started →
          </Link>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-gray-300 text-sm"
        >
          <p>Click anywhere on the screen to throw snowballs!</p>
          <p className="mt-2">
            Need help? Contact support at{' '}
            <a href="mailto:support@giftinggame.com" className="text-green-300 hover:text-green-200">
              support@giftinggame.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
