import Link from 'next/link';
import React from 'react';
import { 
  FileText, 
  Shield, 
  CheckCircle, 
  Layers, 
  Upload, 
  ChevronRight,
  Globe,
  Check,
  Building
} from 'lucide-react';


// Custom SVG icons to match your provided images
const CustomIcons = {
  Folder: () => (
    <svg viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M48 115c0-11 9-20 20-20h150c11 0 20 9 20 20v30h226c11 0 20 9 20 20v282c0 11-9 20-20 20H68c-11 0-20-9-20-20V115z" fill="#FFB52E" />
      <path d="M48 165h384v252c0 11-9 20-20 20H68c-11 0-20-9-20-20V165z" fill="#FFCA80" />
      <path d="M48 165h384v40H48v-40z" fill="#E1F5FE" />
    </svg>
  ),
  DocumentShield: () => (
    <svg viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M330 480H90c-11 0-20-9-20-20V52c0-11 9-20 20-20h220c11 0 20 9 20 20v428z" fill="white" />
      <path d="M310 52H90v428h220V52z" fill="white" />
      <path d="M110 130h180M110 200h100M110 240h100M110 280h100M110 320h100M110 360h100" strokeWidth="18" />
      <path d="M160 100l30-30 30 30" fill="none" />
      <path d="M375 280l-35 35-20-20" fill="none" stroke="#0088ff" strokeWidth="18" />
      <path d="M400 240H310c-11 0-20 9-20 20v80c0 11 9 20 20 20h90c11 0 20-9 20-20v-80c0-11-9-20-20-20z" fill="#B3E5FC" />
      <path d="M250 360v-60c0-11-9-20-20-20H125l-15 20" fill="none" />
    </svg>
  ),
  DocumentGlobal: () => (
    <svg viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M90 40h240v360H90z" fill="white" />
      <path d="M120 100h180M120 150h140M120 200h140M120 250h140M120 300h140M120 350h80" strokeWidth="20" />
      <path d="M150 110l30-30 30 30" fill="none" strokeWidth="20" />
      <circle cx="360" cy="360" r="60" fill="none" strokeWidth="20" />
      <path d="M360 320v80M330 360h60M345 335a40 40 0 0 1 30 0M345 385a40 40 0 0 0 30 0" strokeWidth="16" />
    </svg>
  ),
  DocumentVerified: () => (
    <svg viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M90 40h240v260H90z" fill="white" />
      <path d="M120 40v380l20-10 20 10 20-10 20 10V40H120z" fill="white" />
      <path d="M150 120h180M150 160h140M150 200h140M150 240h140M150 280h140M150 320h80" strokeWidth="20" />
      <path d="M350 170l35 35 70-70" fill="none" strokeWidth="20" />
      <path d="M400 250H310c-11 0-20 9-20 20v80c0 11 9 20 20 20h90c11 0 20-9 20-20v-80c0-11-9-20-20-20z" fill="none" />
      <path d="M360 310l12 12 24-24" stroke="#00C853" strokeWidth="20" />
    </svg>
  ),
  GovernmentCertificate: () => (
    <svg viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M90 80h240v360H90z" fill="#EEEEEE" />
      <path d="M90 80h240v45H90z" fill="#AAAAAA" />
      <path d="M160 140h100M120 180h180M120 220h180M120 260h120M120 300h80M120 340h100" strokeWidth="20" />
      <circle cx="210" cy="190" r="60" fill="#FFCA28" stroke="#FF9800" strokeWidth="16" />
      <path d="M190 190a20 20 0 1 1 6-14M210 190a20 20 0 1 1 14 6M230 190a20 20 0 1 1-6 14" fill="none" stroke="#111111" strokeWidth="12" />
      <path d="M90 425h240v15H90z" fill="#CCCCCC" />
    </svg>
  ),
  GovernmentBuilding: () => (
    <svg viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M256 80l160 80v40H96v-40l160-80z" fill="#D7CCC8" />
      <path d="M136 200v160h80v-160h-80zM296 200v160h80v-160h-80z" fill="none" />
      <path d="M346 200v160M326 200v160M186 200v160M166 200v160" strokeWidth="16" />
      <path d="M96 360h320v40H96z" fill="#D7CCC8" />
      <circle cx="256" cy="120" r="20" fill="none" />
    </svg>
  ),
  LegalDocument: () => (
    <svg viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M225 160h200v270H225z" fill="white" />
      <path d="M250 220h150M250 260h150M250 300h80" strokeWidth="16" />
      <path d="M350 400c-20-30 30-30 10-60" fill="none" strokeWidth="16" />
      <path d="M160 80h-30c-22 0-40 18-40 40v272c0 22 18 40 40 40h30V80z" fill="none" />
      <path d="M160 370h65v62h-65z" fill="none" />
    </svg>
  ),
  TeamGovernment: () => (
    <svg viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M256 70l180 90v40H76v-40l180-90z" fill="#FFCA28" />
      <rect x="136" y="200" width="240" height="160" fill="#EEEEEE" />
      <path d="M176 260v-30h30v30h-30zM241 260v-30h30v30h-30zM306 260v-30h30v30h-30zM176 320v-30h30v30h-30zM241 320v-30h30v30h-30zM306 320v-30h30v30h-30z" fill="#B3E5FC" />
      <circle cx="160" cy="400" r="30" fill="#757575" />
      <circle cx="256" cy="400" r="30" fill="#757575" />
      <circle cx="352" cy="400" r="30" fill="#8D6E63" />
      <path d="M160 430v30M256 430v30M352 430v30" strokeWidth="16" />
      <path d="M130 460h60v30h-60zM226 460h60v30h-60zM322 460h60v30h-60z" fill="#FFF9C4" />
      <path d="M160 470l-10 10 10 10M256 470l-10 10 10 10M352 470l-10 10 10 10" fill="none" strokeWidth="8" />
    </svg>
  ),
  // Adding a new icon for document upload to replace the duplicate
  DocumentUpload: () => (
    <svg viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M330 480H90c-11 0-20-9-20-20V52c0-11 9-20 20-20h220c11 0 20 9 20 20v428z" fill="white" />
      <path d="M310 52H90v428h220V52z" fill="white" />
      <path d="M110 380h180M110 420h100" strokeWidth="18" />
      <path d="M200 80v160M160 120l40-40 40 40" fill="none" strokeWidth="20" stroke="#4CAF50" />
      <path d="M260 200H140c-5 0-10 4-10 9v60c0 5 5 9 10 9h120c5 0 10-4 10-9v-60c0-5-5-9-10-9z" fill="#E8F5E9" stroke="#4CAF50" strokeWidth="8" />
    </svg>
  )
};

const HeroSection = () => {
  return (
    <div name="home" className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Gradient Background with Animated Shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-100 to-green-100 opacity-70">
        {/* Animated Abstract Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-200/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <Shield className="mr-2 text-green-600" size={20} />
            Government Approved Services
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Effortless Document Solutions <br />at Your Fingertips
          </h1>
          
          <p className="text-xl text-gray-600 max-w-xl">
            Fast, Reliable & Government-Approved Legal Documentation Services.
          </p>
          
          {/* Document Service Features */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 text-green-600">
                  <CustomIcons.GovernmentBuilding />
                </div>
              </div>
              <span className="text-gray-700">Government Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 text-green-600">
                  <CustomIcons.DocumentVerified />
                </div>
              </div>
              <span className="text-gray-700">Verified Documents</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 text-green-600">
                  <CustomIcons.DocumentGlobal />
                </div>
              </div>
              <span className="text-gray-700">Global Compliance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 text-green-600">
                  <CustomIcons.LegalDocument />
                </div>
              </div>
              <span className="text-gray-700">Legal Documentation</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
  <Link
    href="/auth/signin"
    className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-1 duration-300 ease-in-out"
  >
    Get Started
    <ChevronRight className="ml-2" size={20} />
  </Link>
  <Link
    href="/track-application"
    className="w-full sm:w-auto border border-green-500 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50/50 transition-all flex items-center justify-center hover:-translate-y-1 duration-300 ease-in-out"
  >
    Track Application
  </Link>
</div>     </div>

        {/* Glassmorphic Document Dashboard Mockup */}
        <div className="relative hidden md:block">
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
            {/* Floating Icons with Glassmorphism */}
            {/* <div className="absolute top-4 right-4 flex space-x-2">
              {[
                { icon: <div className="w-6 h-6"><CustomIcons.Folder /></div>, color: 'text-amber-500' },
                { icon: <div className="w-6 h-6"><CustomIcons.DocumentShield /></div>, color: 'text-blue-500' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`
                    bg-white/30 backdrop-blur-md border border-white/40 
                    p-3 rounded-xl shadow-md transform transition-all duration-300
                    hover:-translate-y-2 hover:shadow-lg
                    ${item.color}
                  `}
                >
                  {item.icon}
                </div>
              ))}
            </div> */}

            {/* Dashboard Mockup - Grid of Document Items */}
            <div className="grid grid-cols-3 gap-4">
              {/* Document Items - Each with hover animation */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg h-16 p-2 flex items-center justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="w-10 h-10 text-amber-500">
                <img src="/images/documentation.png" alt="Document" />

                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg h-16 p-2 flex items-center justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="w-10 h-10 text-blue-500">
                <img src="/images/contract.png" alt="Document" />

                </div>
              </div>
              {/* Empty slot for 1st row, 3rd image to avoid overlap */}
              
              <div className="bg-white/50 backdrop-blur-sm rounded-lg h-16 p-2 flex items-center justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="w-10 h-10 text-blue-500">
                <img src="/images/folder.png" alt="Document" />

                </div>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-lg h-16 p-2 flex items-center justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="w-10 h-10 text-purple-500">
                <img src="/images/documents.png" alt="Document" />

                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg h-16 p-2 flex items-center justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="w-10 h-10 text-gray-700">
                <img src="/images/online-survey.png" alt="Document" />
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg h-16 p-2 flex items-center justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="w-10 h-10 text-amber-600">
                <img src="/images/stamp.png" alt="Document" />
                </div>
              </div>
              {/* Changed this icon from DocumentShield to DocumentUpload to fix the duplicate */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg h-16 p-2 flex items-center justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="w-10 h-10 text-green-500">
                <img src="/images/work-plan.png" alt="Document" />
                </div>
                
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg h-16 p-2 flex items-center justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="w-10 h-10 text-teal-500">
                <img src="/images/folder (1).png" alt="Document" />
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg h-16 p-2 flex items-center justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="w-10 h-10 text-green-600">
                
                <img src="/images/list (1).png" alt="Document" />
                </div>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="mt-4 flex items-center justify-center bg-green-100/50 backdrop-blur-sm p-3 rounded-xl">
              <div className="w-5 h-5 text-green-600 mr-2">
                <CustomIcons.DocumentVerified />
              </div>
              <span className="text-green-800 text-sm">
                All Documents Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;