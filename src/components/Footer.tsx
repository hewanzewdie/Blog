import { PenTool } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/AuthStore'

const Footer = () => {
    const {user} = useAuthStore();

  return (
    <footer className="border-t border-gray-100 bg-white py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600 text-white">
                <PenTool className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                BlogSite
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              A platform for writers and readers to share stories and discover
              great content.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              {user? 
              (
                <>
                <li>
                <Link
                  to="/my-blogs"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  My Stories
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Profile
                </Link>
              </li>
                </>
              )
            :
            (
              <>
              <li>
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  SignUp
                </Link>
              </li>
              </>
            )}
              
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-5 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            © 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
