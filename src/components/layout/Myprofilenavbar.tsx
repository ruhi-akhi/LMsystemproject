"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, MapPin, Link as LinkIcon, 
  CheckCircle2, Package, ShoppingBag
} from "lucide-react";

const PROFILE_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face";

const Myprofilenavbar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "My Profile", href: "/viewprofile/myprofile", icon: User },
    { name: "Address", href: "/viewprofile/address", icon: MapPin },
    { name: "Important Links", href: "/viewprofile/links", icon: LinkIcon },
    { name: "Order History", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  ];

  return (
    <div className="bg-[#11081a] text-white p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl">
      {/* Profile Info Section */}
      <div className="flex flex-col items-center text-center pb-8 border-b border-gray-800 border-dashed relative">
        {/* Top Right Info Icon */}
        <div className="absolute top-0 right-0 text-[#FF6B35] cursor-pointer">
          <Package size={20} />
        </div>

        <div className="relative w-28 h-28 rounded-full border-4 border-[#FF6B35]/20 p-1 mb-4">
          <div className="w-full h-full rounded-full overflow-hidden relative">
            <Image 
              src={PROFILE_AVATAR}
              alt="Profile" 
              fill 
              className="object-cover"
              sizes="112px"
            />
          </div>
          <div className="absolute inset-0 border-t-4 border-[#FF6B35] rounded-full -m-1"></div>
        </div>
        
        <h2 className="text-xl font-bold tracking-tight text-gray-100">Demo User</h2>
        <div className="text-[13px] text-gray-400 space-y-1 mt-2 font-light">
          <p>INV-1001</p>
          <p className="break-all">admin@inventory.com</p>
        </div>
      </div>

      {/* Navigation Links Section */}
      <nav className="mt-8 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={index} 
              href={item.href}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-purple-600/10 text-purple-400 border-l-4 border-purple-600" 
                  : "hover:bg-white/5 text-gray-400"
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon 
                  size={20} 
                  className={isActive ? "text-purple-500" : "text-gray-500 group-hover:text-gray-300"} 
                />
                <span className="text-[15px] font-medium tracking-wide">{item.name}</span>
              </div>
              
             
              <CheckCircle2 
                size={18} 
                className={isActive ? "text-green-500" : "text-gray-800 opacity-40"} 
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Myprofilenavbar;