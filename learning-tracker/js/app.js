class App {
    constructor() {
        this.storage = storage;
        this.bindElements();
        this.bindEvents();
        this.render();
    }

    bindElements() {
        this.learningPathsContainer = document.getElementById('learningPaths');
        this.addResourceModal = document.getElementById('addResourceModal');
        this.addResourceForm = document.getElementById('addResourceForm');
        this.pathIdInput = document.getElementById('pathId');
        this.resourceTitleInput = document.getElementById('resourceTitle');
        this.resourceUrlInput = document.getElementById('resourceUrl');
        this.cancelResourceBtn = document.getElementById('cancelResourceBtn');
    }

    bindEvents() {
        this.addResourceForm.addEventListener('submit', this.handleAddResource.bind(this));
        this.cancelResourceBtn.addEventListener('click', () => this.addResourceModal.classList.add('hidden'));
    }

    render() {
        const paths = this.storage.getLearningPaths();
        this.learningPathsContainer.innerHTML = paths.map(path => this.renderPath(path)).join('');
        
        // Add event listeners to dynamically created elements
        document.querySelectorAll('.add-resource-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showAddResourceModal(btn.dataset.pathId));
        });

        document.querySelectorAll('.resource-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.storage.toggleResource(checkbox.dataset.pathId, checkbox.dataset.resourceId);
                this.render();
            });
        });

        document.querySelectorAll('.delete-resource-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.storage.deleteResource(btn.dataset.pathId, btn.dataset.resourceId);
                this.render();
            });
        });
    }

    renderPath(path) {
        return `
            <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold text-gray-900">${path.name}</h2>
                    <button class="add-resource-btn bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200 transition-colors" data-path-id="${path.id}">
                        <i class="fas fa-plus mr-1"></i>Add Resource
                    </button>
                </div>
                
                <!-- Progress Bar -->
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div class="bg-indigo-600 h-2.5 rounded-full transition-all" style="width: ${path.progress}%"></div>
                </div>
                <p class="text-sm text-gray-600 mb-4">${path.progress}% Complete</p>

                <!-- Resources List -->
                <div class="space-y-3">
                    ${path.resources.map(resource => this.renderResource(path.id, resource)).join('')}
                </div>
                ${path.resources.length === 0 ? '<p class="text-gray-500 text-sm">No resources added yet</p>' : ''}
            </div>
        `;
    }

    renderResource(pathId, resource) {
        return `
            <div class="flex items-center justify-between py-2 border-b last:border-0">
                <div class="flex items-center space-x-3">
                    <input type="checkbox" 
                        class="resource-checkbox w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        data-path-id="${pathId}"
                        data-resource-id="${resource.id}"
                        ${resource.completed ? 'checked' : ''}>
                    <div>
                        <a href="${resource.url}" target="_blank" class="text-gray-900 hover:text-indigo-600 font-medium">
                            ${resource.title}
                        </a>
                        <p class="text-sm text-gray-500">Added: ${new Date(resource.dateAdded).toLocaleDateString()}</p>
                    </div>
                </div>
                <button class="delete-resource-btn text-red-600 hover:text-red-800 transition-colors"
                    data-path-id="${pathId}"
                    data-resource-id="${resource.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }

    showAddResourceModal(pathId) {
        this.pathIdInput.value = pathId;
        this.addResourceModal.classList.remove('hidden');
        this.resourceTitleInput.focus();
    }

    handleAddResource(e) {
        e.preventDefault();
        const pathId = this.pathIdInput.value;
        const resource = {
            title: this.resourceTitleInput.value,
            url: this.resourceUrlInput.value
        };

        this.storage.addResource(pathId, resource);
        this.addResourceForm.reset();
        this.addResourceModal.classList.add('hidden');
        this.render();
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
