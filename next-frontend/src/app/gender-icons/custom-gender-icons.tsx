// Custom Gender Icons - Circle Style like Attachments
import React from 'react';

// Custom Icon Components matching your attachment style
const MaleIcon = ({ className = "h-6 w-6", color = "text-white" }) => (
  <div className={`${className} bg-blue-500 rounded-full flex items-center justify-center`}>
    <svg viewBox="0 0 24 24" fill="currentColor" className={`h-4 w-4 ${color}`}>
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 9.5V11H13V7C13 5.9 13.9 5 15 5V3H9V5C7.9 5 7 5.9 7 7V19C7 20.1 7.9 21 9 21H15C16.1 21 17 20.1 17 19V13H19V11H17V9L21 9Z"/>
    </svg>
  </div>
);

const FemaleIcon = ({ className = "h-6 w-6", color = "text-white" }) => (
  <div className={`${className} bg-pink-500 rounded-full flex items-center justify-center`}>
    <svg viewBox="0 0 24 24" fill="currentColor" className={`h-4 w-4 ${color}`}>
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM8 7H16C17.1 7 18 7.9 18 9V15C18 16.1 17.1 17 16 17H14V19H18V21H6V19H10V17H8C6.9 17 6 16.1 6 15V9C6 7.9 6.9 7 8 7Z"/>
    </svg>
  </div>
);

const OtherIcon = ({ className = "h-6 w-6", color = "text-white" }) => (
  <div className={`${className} bg-purple-500 rounded-full flex items-center justify-center`}>
    <svg viewBox="0 0 24 24" fill="currentColor" className={`h-4 w-4 ${color}`}>
      <path d="M16 4C16 2.9 16.9 2 18 2S20 2.9 20 4 19.1 6 18 6 16 5.1 16 4M6 4C6 2.9 6.9 2 8 2S10 2.9 10 4 9.1 6 8 6 6 5.1 6 4M18 22V16H16V7C16 6.45 15.55 6 15 6H11C10.45 6 10 6.45 10 7V16H8V22H10V17H14V22H18M8 22V16H6V7C6 6.45 5.55 6 5 6H1C0.45 6 0 6.45 0 7V16H-2V22H0V17H4V22H8Z"/>
    </svg>
  </div>
);

// Alternative simpler versions
const SimpleMaleIcon = ({ className = "h-6 w-6" }) => (
  <div className={`${className} bg-blue-500 rounded-full flex items-center justify-center`}>
    <div className="flex flex-col items-center text-white">
      <div className="w-2 h-2 bg-white rounded-full mb-1"></div>
      <div className="w-1 h-3 bg-white rounded"></div>
      <div className="w-3 h-1 bg-white rounded mt-1"></div>
    </div>
  </div>
);

const SimpleFemaleIcon = ({ className = "h-6 w-6" }) => (
  <div className={`${className} bg-pink-500 rounded-full flex items-center justify-center`}>
    <div className="flex flex-col items-center text-white">
      <div className="w-2 h-2 bg-white rounded-full mb-1"></div>
      <div className="w-2 h-2 bg-white rounded-full"></div>
      <div className="w-1 h-2 bg-white rounded"></div>
    </div>
  </div>
);

const SimpleOtherIcon = ({ className = "h-6 w-6" }) => (
  <div className={`${className} bg-purple-500 rounded-full flex items-center justify-center`}>
    <div className="flex items-center gap-0.5 text-white">
      <div className="flex flex-col items-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full mb-0.5"></div>
        <div className="w-0.5 h-2 bg-white rounded"></div>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full mb-0.5"></div>
        <div className="w-1 h-1.5 bg-white rounded-full"></div>
        <div className="w-0.5 h-1 bg-white rounded"></div>
      </div>
    </div>
  </div>
);

// Demo Component
const CustomGenderIconsDemo = () => {
  const iconSets = [
    {
      title: "🎯 Style 1: SVG Based Icons (Professional)",
      icons: [
        { name: "Male", component: MaleIcon, desc: "👨 Blue circle with male figure", bg: "bg-blue-100" },
        { name: "Female", component: FemaleIcon, desc: "👩 Pink circle with female figure", bg: "bg-pink-100" },
        { name: "Other", component: OtherIcon, desc: "🏳️‍⚧️ Purple circle with diverse figures", bg: "bg-purple-100" }
      ]
    },
    {
      title: "🎨 Style 2: Simple Geometric (Minimalist)",
      icons: [
        { name: "Male", component: SimpleMaleIcon, desc: "👨 Blue circle - geometric male", bg: "bg-blue-100" },
        { name: "Female", component: SimpleFemaleIcon, desc: "👩 Pink circle - geometric female", bg: "bg-pink-100" },
        { name: "Other", component: SimpleOtherIcon, desc: "🏳️‍⚧️ Purple circle - mixed figures", bg: "bg-purple-100" }
      ]
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🎯 Custom Gender Icons - Circle Style
        </h1>
        
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold text-blue-800 mb-2">📌 Reference Style:</h3>
          <p className="text-blue-700 text-sm">आपके attachments के जैसे - circular background with simple human figures</p>
        </div>

        {iconSets.map((set, setIdx) => (
          <div key={setIdx} className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-2">
              {set.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {set.icons.map((iconInfo, iconIdx) => {
                const IconComponent = iconInfo.component;
                return (
                  <div key={iconIdx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
                    <div className="flex flex-col items-center space-y-4">
                      {/* Large Preview */}
                      <div className={`p-4 rounded-lg ${iconInfo.bg}`}>
                        <IconComponent className="h-12 w-12" />
                      </div>
                      
                      {/* Small Preview */}
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-6 w-6" />
                        <div className="text-center">
                          <p className="font-medium text-gray-800">{iconInfo.name}</p>
                          <p className="text-xs text-gray-600">{iconInfo.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="mt-12 p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-green-800 mb-4">🏆 Implementation Options:</h3>
          <div className="text-green-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium mb-2">Option 1: Professional SVG</h4>
                <div className="flex items-center gap-2 mb-1">
                  <MaleIcon className="h-5 w-5" />
                  <span className="text-sm">Detailed male figure</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <FemaleIcon className="h-5 w-5" />
                  <span className="text-sm">Detailed female figure</span>
                </div>
                <div className="flex items-center gap-2">
                  <OtherIcon className="h-5 w-5" />
                  <span className="text-sm">Multiple figures</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Option 2: Minimalist</h4>
                <div className="flex items-center gap-2 mb-1">
                  <SimpleMaleIcon className="h-5 w-5" />
                  <span className="text-sm">Geometric male</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <SimpleFemaleIcon className="h-5 w-5" />
                  <span className="text-sm">Geometric female</span>
                </div>
                <div className="flex items-center gap-2">
                  <SimpleOtherIcon className="h-5 w-5" />
                  <span className="text-sm">Mixed geometric</span>
                </div>
              </div>
            </div>
            <p className="text-sm"><strong>कौन सा style पसंद है?</strong> मैं RegisterForm में implement कर दूंगा!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomGenderIconsDemo;
