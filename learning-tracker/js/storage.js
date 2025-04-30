class Storage {
    constructor() {
        this.key = 'learningTrackerData';
        this.data = this.loadData();
    }

    loadData() {
        const data = localStorage.getItem(this.key);
        if (data) {
            return JSON.parse(data);
        }
        return {
            learningPaths: [
                {
                    id: 'frontend',
                    name: 'Frontend Development',
                    progress: 0,
                    resources: []
                },
                {
                    id: 'backend',
                    name: 'Backend Development',
                    progress: 0,
                    resources: []
                },
                {
                    id: 'database',
                    name: 'Database Management',
                    progress: 0,
                    resources: []
                }
            ]
        };
    }

    saveData() {
        localStorage.setItem(this.key, JSON.stringify(this.data));
    }

    getLearningPaths() {
        return this.data.learningPaths;
    }

    addResource(pathId, resource) {
        const path = this.data.learningPaths.find(p => p.id === pathId);
        if (path) {
            path.resources.push({
                id: Date.now().toString(),
                ...resource,
                completed: false,
                dateAdded: new Date().toISOString()
            });
            this.updateProgress(pathId);
            this.saveData();
        }
    }

    toggleResource(pathId, resourceId) {
        const path = this.data.learningPaths.find(p => p.id === pathId);
        if (path) {
            const resource = path.resources.find(r => r.id === resourceId);
            if (resource) {
                resource.completed = !resource.completed;
                this.updateProgress(pathId);
                this.saveData();
            }
        }
    }

    updateProgress(pathId) {
        const path = this.data.learningPaths.find(p => p.id === pathId);
        if (path && path.resources.length > 0) {
            const completed = path.resources.filter(r => r.completed).length;
            path.progress = Math.round((completed / path.resources.length) * 100);
        } else {
            path.progress = 0;
        }
    }

    deleteResource(pathId, resourceId) {
        const path = this.data.learningPaths.find(p => p.id === pathId);
        if (path) {
            path.resources = path.resources.filter(r => r.id !== resourceId);
            this.updateProgress(pathId);
            this.saveData();
        }
    }
}

const storage = new Storage();
