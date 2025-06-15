import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card } from '../ui/Card';
import { testimonials } from '../../data/mockData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Don't Just Take Our <span className="bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">Word</span> For It
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of developers who've transformed their careers and found their coding soulmates
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>

                <div className="relative">
                  <Quote size={24} className="text-secondary-500/30 absolute -top-2 -left-2" />
                  <p className="text-gray-300 leading-relaxed pl-6">
                    {testimonial.content}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center">
              <Star size={20} className="text-yellow-400 mr-2" />
              <span>4.9/5 average rating</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              <span>98% satisfaction rate</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
              <span>Trusted by 15k+ developers</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};