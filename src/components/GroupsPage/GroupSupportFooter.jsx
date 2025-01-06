import React from 'react'
import { AlertTriangle } from 'lucide-react'

const GroupSupportFooter = () => {
  return (
    <div>
        <div>
            <footer className="bg-blue-50 border-t border-blue-100 py-4">
                    <div className="max-w-6xl mx-auto px-4">
                      <div className="flex items-start space-x-4">
                        <AlertTriangle className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-blue-800 mb-1">Safety Notice</h4>
                          <p className="text-sm text-blue-600">
                            This is a peer support community. If you're experiencing a crisis or need immediate help, 
                            please contact professional mental health services or emergency services.
                          </p>
                        </div>
                      </div>
                    </div>
                  </footer>
        </div>
        <div>
            main footer for the group page
        </div>
    </div>
  )
}

export default GroupSupportFooter