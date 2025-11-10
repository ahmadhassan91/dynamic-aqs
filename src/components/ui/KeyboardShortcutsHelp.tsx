'use client';

import React, { useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { AccessibleModal } from './AccessibleComponents';
import { formatShortcut, getShortcutsByCategory } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category?: string;
}

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[];
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelp({ shortcuts, isOpen, onClose }: KeyboardShortcutsHelpProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categorizedShortcuts = getShortcutsByCategory(shortcuts);
  const categories = ['all', ...Object.keys(categorizedShortcuts)];

  const filteredShortcuts = selectedCategory === 'all' 
    ? shortcuts 
    : categorizedShortcuts[selectedCategory] || [];

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      size="lg"
    >
      <div className="space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full border capitalize ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Shortcuts List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {selectedCategory === 'all' ? (
            Object.entries(categorizedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium text-gray-900 capitalize border-b border-gray-200 pb-1">
                  {category}
                </h4>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <ShortcutItem key={`${category}-${index}`} shortcut={shortcut} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-2">
              {filteredShortcuts.map((shortcut, index) => (
                <ShortcutItem key={index} shortcut={shortcut} />
              ))}
            </div>
          )}

          {filteredShortcuts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No shortcuts found for this category.
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Shortcuts work when not typing in input fields</li>
            <li>• Press <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">?</kbd> anytime to open this help</li>
            <li>• Use <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Esc</kbd> to close modals and dropdowns</li>
          </ul>
        </div>
      </div>
    </AccessibleModal>
  );
}

interface ShortcutItemProps {
  shortcut: KeyboardShortcut;
}

function ShortcutItem({ shortcut }: ShortcutItemProps) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-700">{shortcut.description}</span>
      <KeyboardKey shortcut={formatShortcut(shortcut)} />
    </div>
  );
}

interface KeyboardKeyProps {
  shortcut: string;
}

function KeyboardKey({ shortcut }: KeyboardKeyProps) {
  const keys = shortcut.split(' + ');
  
  return (
    <div className="flex items-center space-x-1">
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          {index > 0 && <span className="text-gray-400 text-xs">+</span>}
          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono shadow-sm">
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </div>
  );
}

// Floating keyboard shortcuts button
interface KeyboardShortcutsButtonProps {
  shortcuts: KeyboardShortcut[];
  className?: string;
}

export function KeyboardShortcutsButton({ shortcuts, className = '' }: KeyboardShortcutsButtonProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsHelpOpen(true)}
        className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        data-shortcuts-help
        title="Keyboard Shortcuts (Shift + ?)"
      >
        <Keyboard size={16} className="mr-2" />
        Shortcuts
      </button>

      <KeyboardShortcutsHelp
        shortcuts={shortcuts}
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </>
  );
}

// Command palette component
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Array<{
    id: string;
    title: string;
    description?: string;
    action: () => void;
    shortcut?: string;
    category?: string;
  }>;
}

export function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description?.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev === 0 ? filteredCommands.length - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-20 px-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="w-full px-0 py-2 text-lg border-0 focus:ring-0 focus:outline-none"
              autoFocus
              data-command-palette
            />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No commands found
              </div>
            ) : (
              filteredCommands.map((command, index) => (
                <button
                  key={command.id}
                  onClick={() => {
                    command.action();
                    onClose();
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                    index === selectedIndex ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{command.title}</div>
                      {command.description && (
                        <div className="text-sm text-gray-500">{command.description}</div>
                      )}
                    </div>
                    {command.shortcut && (
                      <KeyboardKey shortcut={command.shortcut} />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}