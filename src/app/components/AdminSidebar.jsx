"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Settings, 
  CreditCard, 
  Calendar, 
  Briefcase, 
  Shield, 
  Database, 
  RefreshCw, 
  Menu, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import Image from 'next/image';

const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const SidebarItem = ({ icon: Icon, label, href }) => (
    <Link 
      href={href} 
      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200 group rounded-lg mx-2"
    >
      <Icon className="mr-3 text-gray-600 group-hover:text-blue-600" size={20} />
      {isExpanded && (
        <span className="text-sm text-gray-700 group-hover:text-blue-700 font-medium">
          {label}
        </span>
      )}
    </Link>
  );

  return (
    <div 
      className={`
         left-0 top-0 bottom-0 
        bg-white border-r border-gray-200 
        shadow-xl transition-all duration-300 ease-in-out
        w-1/6
        overflow-y-auto
        flex flex-col
      `}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isExpanded && (
          <div className="flex items-center">
            <Image
            width={1920}
            height={1080} 
              src="/images/logo.svg" 
              alt="Dokument Guru Logo" 
              className="w-10 h-10 mr-3 rounded-full"
            />
            <span className="text-lg font-bold text-gray-800">Dokument Guru</span>
          </div>
        )}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          {isExpanded ? <ChevronLeft className="text-gray-600" /> : <ChevronRight className="text-gray-600" />}
        </button>
      </div>

      {/* Sidebar Content */}
      <nav className="flex-1 pt-4">
        {/* Agent Management */}
        <div className="mb-4">
          {isExpanded && <h3 className="px-4 text-xs uppercase text-gray-500 font-semibold mb-2">Agent Management</h3>}
          <SidebarItem 
            icon={UserPlus} 
            label="Register Agent" 
            href="/admin/register-agent"
          />
          <SidebarItem 
            icon={FileText} 
            label="Agent Requests" 
            href="/admin/agent-request"
          />
          <SidebarItem 
            icon={Users} 
            label="Registered Agents" 
            href="/admin/registered-agents"
          />
        </div>

        {/* Staff Management */}
        <div className="mb-4">
          {isExpanded && <h3 className="px-4 text-xs uppercase text-gray-500 font-semibold mb-2">Staff Management</h3>}
          <SidebarItem 
            icon={UserPlus} 
            label="Register Staff" 
            href="/admin/register-staff"
          />
          <SidebarItem 
            icon={Shield} 
            label="Staff Manager" 
            href="/admin/staff-manager"
          />
        </div>

        {/* Service Management */}
        <div className="mb-4">
          {isExpanded && <h3 className="px-4 text-xs uppercase text-gray-500 font-semibold mb-2">Service Management</h3>}
          <SidebarItem 
            icon={Briefcase} 
            label="Service Groups" 
            href="/admin/service-groups"
          />
          <SidebarItem 
            icon={Settings} 
            label="Manage Services" 
            href="/admin/manage-services"
          />
          <SidebarItem 
            icon={CreditCard} 
            label="Manage Plans" 
            href="/admin/manage-plans"
          />
        </div>

        {/* Financial Management */}
        <div className="mb-4">
          {isExpanded && <h3 className="px-4 text-xs uppercase text-gray-500 font-semibold mb-2">Financial Management</h3>}
          <SidebarItem 
            icon={RefreshCw} 
            label="Recharge History" 
            href="/admin/recharge-history"
          />
          <SidebarItem 
            icon={Calendar} 
            label="Appointments" 
            href="/admin/appointments"
          />
          <SidebarItem 
            icon={FileText} 
            label="Create Bill" 
            href="/admin/create-bill"
          />
          <SidebarItem 
            icon={FileText} 
            label="View Bill" 
            href="/admin/view-bill"
          />
        </div>

        {/* System Options */}
        <div className="mb-4">
          {isExpanded && <h3 className="px-4 text-xs uppercase text-gray-500 font-semibold mb-2">System Options</h3>}
          <SidebarItem 
            icon={Database} 
            label="Troubleshoot" 
            href="/admin/troubleshoot"
          />
          <SidebarItem 
            icon={Database} 
            label="Clear Database" 
            href="/admin/clear-database"
          />
        </div>
      </nav>

      {/* Footer */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">© 2024 Dokument Guru</p>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;