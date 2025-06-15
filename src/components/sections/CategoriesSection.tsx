import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { contentCategories } from '../../data/mockData';

export const CategoriesSection: React.FC = () => {
  return (
    <section id="categories" className="py-20 bg-gradient-to-b from-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore Our <span className="bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">Spicy</span> Content Categories
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From intimate debugging sessions to sultry algorithm explanations - we've got content that will make your code compile and your heart race
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contentCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="group cursor-pointer h-full">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-secondary-500 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    <span className="font-semibold text-white">{category.contentCount}</span> videos available
                  </div>
                  <motion.div
                    className="flex items-center text-secondary-500 group-hover:translate-x-2 transition-transform"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm font-medium mr-2">Explore</span>
                    <ArrowRight size={16} />
                  </motion.div>
                </div>

                {/* Category preview thumbnails */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-video bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-lg border border-primary-500/20 flex items-center justify-center group-hover:scale-105 transition-transform"
                    >
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Featured Category Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-secondary-500/10 to-primary-500/10 border border-secondary-500/20 rounded-2xl p-8">
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-2xl font-bold text-white mb-2">Most Popular This Week</h3>
            <p className="text-gray-300 mb-4">
              "Dirty Algorithms" is trending with 89% more views than last week
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <span>• 1.2k new videos</span>
              <span>• 45k interactions</span>
              <span>• 4.8★ average rating</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};