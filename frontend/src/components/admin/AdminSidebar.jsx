import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { user } = useContext(AuthContext);

    // Sidebar links configuration based on roles
    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { name: 'Orders', path: '/admin/orders', icon: '🛍️' },
        { name: 'Menu Management', path: '/admin/menu', icon: '🍽️' },
    ];

    // Only show "Kitchen Management" to Super Admins
    if (user?.role === 'admin') {
        navItems.push({ name: 'Kitchen Management', path: '/admin/kitchens', icon: '🏢' });
    }

    return (
        <aside className="w-64 bg-white shadow-xl min-h-screen sticky top-20 hidden md:block border-r border-gray-100">
            <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-6">Main Menu</p>
                
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => 
                                `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${
                                    isActive 
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' 
                                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                }`
                            }
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Kitchen Profile shortcut at the bottom */}
            <div className="absolute bottom-10 left-0 w-full px-6">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Logged in as</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{user?.fullName}</p>
                    <p className="text-[10px] uppercase font-bold text-orange-600 mt-1">{user?.role}</p>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;