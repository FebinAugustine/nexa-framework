import { html } from '../core/framework';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
}

export function Notification({ type, message, onClose }: NotificationProps) {
  const styles = {
    success: 'bg-green-900/50 border-green-700 text-green-300',
    error: 'bg-red-900/50 border-red-700 text-red-300',
    warning: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
    info: 'bg-blue-900/50 border-blue-700 text-blue-300'
  };

  return html`
    <div class="${styles[type]} border p-4 rounded-md shadow-md flex justify-between items-center mb-4 transition-opacity duration-300">
      <div class="flex items-center">
        ${type === 'success' ? html`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>` : ''}
        ${type === 'error' ? html`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>` : ''}
        ${type === 'warning' ? html`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>` : ''}
        ${type === 'info' ? html`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>` : ''}
        <span>${message}</span>
      </div>
      <button 
        onClick="${onClose}"
        class="ml-4 text-gray-400 hover:text-gray-200 focus:outline-none"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
}
