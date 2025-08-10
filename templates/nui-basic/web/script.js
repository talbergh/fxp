// Modern NUI JavaScript with FiveM communication
class NUIManager {
    constructor() {
        this.app = document.getElementById('app');
        this.isVisible = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupMessageHandlers();
        this.hide(); // Start hidden
    }

    bindEvents() {
        // Close button
        document.getElementById('closeBtn').addEventListener('click', () => {
            this.hide();
        });

        // Action buttons
        document.getElementById('testBtn').addEventListener('click', () => {
            this.sendMessage('testAction', { message: 'Test button clicked!' });
        });

        document.getElementById('infoBtn').addEventListener('click', () => {
            this.sendMessage('getPlayerInfo');
        });

        // ESC key to close
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });

        // Prevent right-click context menu
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
    }

    setupMessageHandlers() {
        window.addEventListener('message', (event) => {
            const data = event.data;
            
            switch (data.action) {
                case 'show':
                    this.show(data.data);
                    break;
                case 'hide':
                    this.hide();
                    break;
                case 'updatePlayerInfo':
                    this.updatePlayerInfo(data.data);
                    break;
                case 'showNotification':
                    this.showNotification(data.data);
                    break;
                default:
                    console.log('Unknown action:', data.action);
            }
        });
    }

    show(data = {}) {
        this.isVisible = true;
        this.app.classList.remove('hidden');
        
        // Focus management for accessibility
        this.app.focus();
        
        // Enable cursor
        this.sendMessage('setNuiFocus', { hasFocus: true, hasCursor: true });
        
        // Update data if provided
        if (data.playerInfo) {
            this.updatePlayerInfo(data.playerInfo);
        }
    }

    hide() {
        this.isVisible = false;
        this.app.classList.add('hidden');
        
        // Disable cursor
        this.sendMessage('setNuiFocus', { hasFocus: false, hasCursor: false });
    }

    updatePlayerInfo(playerInfo) {
        const nameEl = document.getElementById('playerName');
        const idEl = document.getElementById('playerId');
        
        if (nameEl) nameEl.textContent = playerInfo.name || '-';
        if (idEl) idEl.textContent = playerInfo.id || '-';
    }

    showNotification(notification) {
        // You could implement custom notifications here
        console.log('Notification:', notification);
    }

    sendMessage(action, data = {}) {
        // Post message to FiveM client
        fetch(`https://${GetParentResourceName()}/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch(error => {
            console.error('Failed to send message:', error);
        });
    }
}

// Utility function for resource name
function GetParentResourceName() {
    // This should return the resource name in FiveM context
    return window.GetParentResourceName ? window.GetParentResourceName() : 'nui-basic';
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NUIManager();
});

// Debug helpers (remove in production)
if (window.location.protocol === 'file:') {
    console.log('🔧 NUI Debug Mode - Simulating FiveM environment');
    
    // Simulate some test data
    setTimeout(() => {
        window.dispatchEvent(new MessageEvent('message', {
            data: {
                action: 'show',
                data: {
                    playerInfo: {
                        name: 'TestPlayer',
                        id: '1'
                    }
                }
            }
        }));
    }, 1000);
}
