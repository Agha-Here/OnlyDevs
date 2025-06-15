import React from 'react';
import { Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 border-t border-primary-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center">
                <Heart size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">OnlyDevs</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              The revolutionary platform where developers monetize their expertise and subscribers get the mentorship they deserve. 
              Finally, a place that treats code like the art it is.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-secondary-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary-500 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary-500 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary-500 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Browse Creators</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Categories</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Become a Creator</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Creator Guidelines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-500/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            © 2025 OnlyDevs. Made with 💜 by developers, for developers.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              All systems operational
            </span>
            <span>🔒 SSL Secured</span>
            <span>🌍 Available worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};