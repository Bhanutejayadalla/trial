// SQLite-Powered CivicReport System - Main Application Logic

class CivicReportSQLiteDB {
    constructor() {
        this.dbName = 'CivicReportSQLiteDB';
        this.version = 1;
        this.db = null;
        this.isInitialized = false;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                this.seedData().then(() => {
                    this.isInitialized = true;
                    resolve(this.db);
                });
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Reports table - matching SQLite schema
                if (!db.objectStoreNames.contains('reports')) {
                    const reportsStore = db.createObjectStore('reports', { keyPath: 'id', autoIncrement: true });
                    reportsStore.createIndex('category', 'category', { unique: false });
                    reportsStore.createIndex('status', 'status', { unique: false });
                    reportsStore.createIndex('priority', 'priority', { unique: false });
                    reportsStore.createIndex('created_at', 'created_at', { unique: false });
                    reportsStore.createIndex('citizen_contact', 'citizen_contact', { unique: false });
                    reportsStore.createIndex('assigned_department', 'assigned_department', { unique: false });
                }
                
                // Users table - matching SQLite schema
                if (!db.objectStoreNames.contains('users')) {
                    const usersStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                    usersStore.createIndex('email', 'email', { unique: true });
                    usersStore.createIndex('role', 'role', { unique: false });
                    usersStore.createIndex('department', 'department', { unique: false });
                }
                
                // Categories table - matching SQLite schema
                if (!db.objectStoreNames.contains('categories')) {
                    const categoriesStore = db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
                    categoriesStore.createIndex('name', 'name', { unique: true });
                }
                
                // Departments table - matching SQLite schema
                if (!db.objectStoreNames.contains('departments')) {
                    const departmentsStore = db.createObjectStore('departments', { keyPath: 'id', autoIncrement: true });
                    departmentsStore.createIndex('name', 'name', { unique: true });
                }
            };
        });
    }

    async seedData() {
        // Sample data matching the provided JSON structure
        const sampleData = {
            reports: [
                {
                    title: "Large pothole on Main Street",
                    description: "Deep pothole causing damage to vehicles near intersection of Main St and Oak Ave. Approximately 2 feet wide and 6 inches deep.",
                    category: "Potholes",
                    priority: "High",
                    status: "In Progress",
                    latitude: 40.7128,
                    longitude: -74.0060,
                    address: "Main St & Oak Ave, Downtown",
                    photo_path: null,
                    citizen_contact: "john.smith@email.com",
                    assigned_department: "Public Works",
                    internal_notes: "Work crew scheduled for tomorrow morning. Materials ordered.",
                    created_at: new Date('2025-01-15T10:30:00Z').toISOString(),
                    updated_at: new Date('2025-01-16T09:15:00Z').toISOString()
                },
                {
                    title: "Broken street light creating safety hazard",
                    description: "Street light has been out for over a week on Pine Street, creating safety concerns for pedestrians at night.",
                    category: "Street Lights",
                    priority: "Medium",
                    status: "Pending",
                    latitude: 40.7130,
                    longitude: -74.0065,
                    address: "Pine Street near Central Park",
                    photo_path: null,
                    citizen_contact: "jane.doe@email.com",
                    assigned_department: "Electrical Services",
                    internal_notes: "Technician will assess tomorrow",
                    created_at: new Date('2025-01-20T14:15:00Z').toISOString(),
                    updated_at: new Date('2025-01-20T14:15:00Z').toISOString()
                },
                {
                    title: "Overflowing trash bin attracting pests",
                    description: "Large trash bin in Central Park has been overflowing for several days, attracting rodents and creating unsanitary conditions.",
                    category: "Trash Collection",
                    priority: "Medium",
                    status: "Resolved",
                    latitude: 40.7135,
                    longitude: -74.0070,
                    address: "Central Park East Entrance",
                    photo_path: null,
                    citizen_contact: "mike.johnson@email.com",
                    assigned_department: "Sanitation",
                    internal_notes: "Emptied and scheduled for more frequent collection. Issue resolved.",
                    created_at: new Date('2025-01-10T09:45:00Z').toISOString(),
                    updated_at: new Date('2025-01-12T11:30:00Z').toISOString()
                },
                {
                    title: "Water main leak flooding sidewalk",
                    description: "Significant water leak from underground pipe causing flooding on sidewalk and potential property damage.",
                    category: "Water Issues",
                    priority: "Emergency",
                    status: "In Progress",
                    latitude: 40.7140,
                    longitude: -74.0055,
                    address: "Elm Street residential area",
                    photo_path: null,
                    citizen_contact: "sarah.wilson@email.com",
                    assigned_department: "Water Department",
                    internal_notes: "Emergency crew dispatched. Water main shut-off completed.",
                    created_at: new Date('2025-01-25T08:15:00Z').toISOString(),
                    updated_at: new Date('2025-01-25T09:00:00Z').toISOString()
                },
                {
                    title: "Missing stop sign at intersection",
                    description: "Stop sign was knocked down during recent storm and has not been replaced, creating dangerous intersection.",
                    category: "Traffic Signs",
                    priority: "High",
                    status: "Pending",
                    latitude: 40.7125,
                    longitude: -74.0075,
                    address: "Oak Ave & Maple Street intersection",
                    photo_path: null,
                    citizen_contact: "robert.brown@email.com",
                    assigned_department: "Traffic Management",
                    internal_notes: "Temporary stop sign installed. Permanent replacement ordered.",
                    created_at: new Date('2025-01-22T16:20:00Z').toISOString(),
                    updated_at: new Date('2025-01-23T08:45:00Z').toISOString()
                }
            ],
            categories: [
                {name: "Potholes", department_mapping: "Public Works", description: "Road surface damage and pothole repairs"},
                {name: "Street Lights", department_mapping: "Electrical Services", description: "Street lighting maintenance and repairs"},
                {name: "Trash Collection", department_mapping: "Sanitation", description: "Waste management and collection issues"},
                {name: "Water Issues", department_mapping: "Water Department", description: "Water main breaks, leaks, and water quality issues"},
                {name: "Traffic Signs", department_mapping: "Traffic Management", description: "Traffic signage installation and maintenance"},
                {name: "Graffiti", department_mapping: "Public Works", description: "Graffiti removal and vandalism cleanup"},
                {name: "Parks & Recreation", department_mapping: "Parks Department", description: "Park maintenance and recreational facility issues"},
                {name: "Other", department_mapping: "General Services", description: "General civic issues not covered by other categories"}
            ],
            departments: [
                {name: "Public Works", contact_email: "publicworks@city.gov", contact_phone: "(555) 123-4567", description: "Road maintenance, infrastructure, and general city services"},
                {name: "Electrical Services", contact_email: "electrical@city.gov", contact_phone: "(555) 123-4568", description: "Street lighting and electrical infrastructure"},
                {name: "Sanitation", contact_email: "sanitation@city.gov", contact_phone: "(555) 123-4569", description: "Waste management and collection services"},
                {name: "Water Department", contact_email: "water@city.gov", contact_phone: "(555) 123-4570", description: "Water supply, distribution, and quality management"},
                {name: "Traffic Management", contact_email: "traffic@city.gov", contact_phone: "(555) 123-4571", description: "Traffic control systems and road safety"},
                {name: "Parks Department", contact_email: "parks@city.gov", contact_phone: "(555) 123-4572", description: "Parks, recreation facilities, and green spaces"},
                {name: "General Services", contact_email: "general@city.gov", contact_phone: "(555) 123-4573", description: "General municipal services and coordination"}
            ],
            users: [
                {name: "Admin User", email: "admin@city.gov", password_hash: "admin123", role: "admin", department: "Administration", created_at: new Date().toISOString()},
                {name: "John Worker", email: "john.worker@city.gov", password_hash: "worker123", role: "staff", department: "Public Works", created_at: new Date().toISOString()},
                {name: "Jane Electric", email: "jane.electric@city.gov", password_hash: "staff123", role: "staff", department: "Electrical Services", created_at: new Date().toISOString()},
                {name: "Mike Sanitation", email: "mike.sanitation@city.gov", password_hash: "staff123", role: "staff", department: "Sanitation", created_at: new Date().toISOString()},
                {name: "Sarah Water", email: "sarah.water@city.gov", password_hash: "staff123", role: "staff", department: "Water Department", created_at: new Date().toISOString()}
            ]
        };

        // Check if data already exists
        try {
            const existingReports = await this.select('reports');
            if (existingReports.length === 0) {
                // Seed the database with sample data
                for (const [tableName, records] of Object.entries(sampleData)) {
                    for (const record of records) {
                        await this.insert(tableName, record);
                    }
                }
                console.log('Database seeded with sample data');
            }
        } catch (error) {
            console.log('Error seeding data:', error);
        }
    }

    // SQLite-style INSERT operation
    async insert(tableName, data) {
        if (!this.db) return null;
        const transaction = this.db.transaction([tableName], 'readwrite');
        const store = transaction.objectStore(tableName);
        
        // Add timestamps for reports if not present
        if (tableName === 'reports') {
            const now = new Date().toISOString();
            data.created_at = data.created_at || now;
            data.updated_at = data.updated_at || now;
            data.status = data.status || 'Pending';
        }
        
        return new Promise((resolve, reject) => {
            const request = store.add(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // SQLite-style SELECT operation
    async select(tableName, where = null, orderBy = null) {
        if (!this.db) return [];
        const transaction = this.db.transaction([tableName], 'readonly');
        const store = transaction.objectStore(tableName);
        
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                let results = request.result;
                
                // Apply WHERE clause filtering
                if (where) {
                    results = results.filter(record => {
                        return Object.entries(where).every(([key, value]) => {
                            if (typeof value === 'object' && value.like) {
                                return record[key] && record[key].toLowerCase().includes(value.like.toLowerCase());
                            }
                            return record[key] === value;
                        });
                    });
                }
                
                // Apply ORDER BY
                if (orderBy) {
                    results.sort((a, b) => {
                        const aVal = a[orderBy.field];
                        const bVal = b[orderBy.field];
                        if (orderBy.direction === 'DESC') {
                            return bVal > aVal ? 1 : -1;
                        }
                        return aVal > bVal ? 1 : -1;
                    });
                }
                
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    }

    // SQLite-style UPDATE operation
    async update(tableName, data, where) {
        if (!this.db) return null;
        const transaction = this.db.transaction([tableName], 'readwrite');
        const store = transaction.objectStore(tableName);
        
        // Add updated timestamp for reports
        if (tableName === 'reports') {
            data.updated_at = new Date().toISOString();
        }
        
        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // SQLite-style COUNT operation
    async count(tableName, where = null) {
        const results = await this.select(tableName, where);
        return results.length;
    }

    // Get reports with JOIN-like functionality
    async getReportsWithDetails() {
        const reports = await this.select('reports', null, {field: 'created_at', direction: 'DESC'});
        const categories = await this.select('categories');
        const departments = await this.select('departments');
        
        return reports.map(report => {
            const category = categories.find(c => c.name === report.category);
            const department = departments.find(d => d.name === report.assigned_department);
            
            return {
                ...report,
                category_details: category,
                department_details: department
            };
        });
    }

    // Analytics queries
    async getReportStatistics() {
        const reports = await this.select('reports');
        
        const stats = {
            total: reports.length,
            pending: reports.filter(r => r.status === 'Pending').length,
            inProgress: reports.filter(r => r.status === 'In Progress').length,
            resolved: reports.filter(r => r.status === 'Resolved').length,
            byCategory: {},
            byDepartment: {},
            byPriority: {}
        };
        
        // Group by category
        reports.forEach(report => {
            stats.byCategory[report.category] = (stats.byCategory[report.category] || 0) + 1;
            stats.byDepartment[report.assigned_department] = (stats.byDepartment[report.assigned_department] || 0) + 1;
            stats.byPriority[report.priority] = (stats.byPriority[report.priority] || 0) + 1;
        });
        
        return stats;
    }
}

class CivicReportApp {
    constructor() {
        this.db = new CivicReportSQLiteDB();
        this.currentPage = 'landingPage';
        this.currentUser = null;
        this.map = null;
        this.charts = {};
        this.currentLocation = null;
        this.isInitialized = false;
        this.wsConnection = null; // WebSocket simulation
    }

    async init() {
        try {
            await this.db.init();
            this.setupEventListeners();
            await this.updateStats();
            this.showPage('landingPage');
            this.simulateWebSocket();
            this.isInitialized = true;
            console.log('SQLite-powered CivicReport app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showToast('Failed to initialize application', 'error');
        }
    }

    simulateWebSocket() {
        // Simulate real-time WebSocket connection
        this.wsConnection = {
            connected: true,
            send: (data) => {
                console.log('WebSocket send:', data);
                // Simulate real-time notifications
                if (data.type === 'report_submitted') {
                    setTimeout(() => {
                        this.showToast('New report received by department', 'success');
                    }, 1000);
                }
            },
            onMessage: (callback) => {
                // Simulate incoming messages
                setInterval(() => {
                    if (this.currentUser && Math.random() > 0.95) {
                        callback({
                            type: 'status_update',
                            message: 'Report status updated'
                        });
                    }
                }, 10000);
            }
        };
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('homeBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('landingPage');
        });
        
        document.getElementById('mapBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('mapPage');
        });
        
        document.getElementById('trackBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('trackPage');
        });
        
        document.getElementById('adminBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('adminLogin');
        });
        
        // Report form
        document.getElementById('reportIssueBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('reportForm');
            // Load categories when showing the form - this fixes the bug
            setTimeout(() => this.loadCategories(), 100);
        });
        
        document.getElementById('cancelReportBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('landingPage');
        });
        
        document.getElementById('issueForm')?.addEventListener('submit', (e) => this.handleReportSubmit(e));
        
        // Photo upload
        document.getElementById('takePhotoBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('photoInput')?.click();
        });
        
        document.getElementById('photoInput')?.addEventListener('change', (e) => this.handlePhotoUpload(e));
        
        // Location
        document.getElementById('getLocationBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.getCurrentLocation();
        });
        
        // Admin
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleAdminLogin(e));
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });
        
        // Admin tabs
        document.getElementById('dashboardTab')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAdminTab('dashboard');
        });
        document.getElementById('reportsTab')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAdminTab('reports');
        });
        document.getElementById('analyticsTab')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAdminTab('analytics');
        });
        document.getElementById('usersTab')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAdminTab('users');
        });
        document.getElementById('settingsTab')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAdminTab('settings');
        });
        
        // Track reports
        document.getElementById('loadReportsBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.loadUserReports();
        });
        
        // Modal
        document.getElementById('closeModal')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal();
        });
        document.getElementById('closeModalBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal();
        });
        
        // User modal
        document.getElementById('addUserBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showUserModal();
        });
        document.getElementById('closeUserModal')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideUserModal();
        });
        document.getElementById('saveUserBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.saveUser();
        });
        document.getElementById('cancelUserBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideUserModal();
        });
        
        // Database actions
        document.getElementById('backupDbBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.backupDatabase();
        });
        document.getElementById('clearDataBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.clearDatabase();
        });
        
        // Toast
        document.getElementById('closeToast')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideToast();
        });
    }

    showPage(pageId) {
        console.log('Showing page:', pageId);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Update nav active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        } else {
            console.error('Page not found:', pageId);
            return;
        }
        
        // Update nav active state
        const navMap = {
            'landingPage': 'homeBtn',
            'mapPage': 'mapBtn',
            'trackPage': 'trackBtn',
            'adminLogin': 'adminBtn',
            'adminDashboard': 'adminBtn'
        };
        
        if (navMap[pageId]) {
            const navBtn = document.getElementById(navMap[pageId]);
            if (navBtn) navBtn.classList.add('active');
        }
        
        // Handle page-specific logic
        if (pageId === 'mapPage') {
            setTimeout(() => this.initMap(), 100);
        } else if (pageId === 'adminDashboard') {
            setTimeout(() => this.updateAdminDashboard(), 100);
        }
    }

    async loadCategories() {
        try {
            console.log('Loading categories...');
            const categories = await this.db.select('categories');
            console.log('Categories loaded:', categories);
            
            const categorySelect = document.getElementById('category');
            const mapCategoryFilter = document.getElementById('mapCategoryFilter');
            const adminCategoryFilter = document.getElementById('adminCategoryFilter');
            
            if (categorySelect) {
                categorySelect.innerHTML = '<option value="">Select category...</option>';
                categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.name;
                    option.textContent = cat.name;
                    categorySelect.appendChild(option);
                });
                console.log('Category select populated with', categories.length, 'categories');
            }
            
            if (mapCategoryFilter) {
                mapCategoryFilter.innerHTML = '<option value="">All Categories</option>';
                categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.name;
                    option.textContent = cat.name;
                    mapCategoryFilter.appendChild(option);
                });
            }
            
            if (adminCategoryFilter) {
                adminCategoryFilter.innerHTML = '<option value="">All Categories</option>';
                categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.name;
                    option.textContent = cat.name;
                    adminCategoryFilter.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
            this.showToast('Failed to load categories', 'error');
        }
    }

    async handleReportSubmit(e) {
        e.preventDefault();
        
        const photoFile = document.getElementById('photoInput').files[0];
        
        const report = {
            title: document.getElementById('title').value.trim(),
            description: document.getElementById('description').value.trim(),
            category: document.getElementById('category').value,
            priority: document.getElementById('priority').value,
            citizen_contact: document.getElementById('contactEmail').value.trim(),
            latitude: this.currentLocation?.lat || null,
            longitude: this.currentLocation?.lng || null,
            address: this.currentLocation?.address || document.getElementById('manualAddress').value.trim(),
            photo_path: photoFile ? await this.convertToBase64(photoFile) : null,
            internal_notes: ''
        };
        
        // Auto-assign department based on category
        try {
            const categories = await this.db.select('categories');
            const category = categories.find(c => c.name === report.category);
            if (category) {
                report.assigned_department = category.department_mapping;
            }
        } catch (error) {
            console.error('Failed to assign department:', error);
        }
        
        try {
            const reportId = await this.db.insert('reports', report);
            this.showToast(`Report #${reportId} submitted successfully! Department has been notified.`, 'success');
            this.resetReportForm();
            this.showPage('landingPage');
            await this.updateStats();
            
            // Simulate WebSocket notification
            if (this.wsConnection) {
                this.wsConnection.send({
                    type: 'report_submitted',
                    reportId,
                    department: report.assigned_department
                });
            }
        } catch (error) {
            console.error('Failed to submit report:', error);
            this.showToast('Failed to submit report. Please try again.', 'error');
        }
    }

    async handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file
            if (!file.type.startsWith('image/')) {
                this.showToast('Please select a valid image file', 'error');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                this.showToast('Image file too large. Please select a file under 5MB', 'error');
                return;
            }
            
            const preview = document.getElementById('photoPreview');
            const reader = new FileReader();
            
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Photo preview">`;
                preview.classList.remove('hidden');
            };
            
            reader.readAsDataURL(file);
        }
    }

    async convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
                    };
                    
                    const locationDisplay = document.getElementById('locationDisplay');
                    if (locationDisplay) {
                        locationDisplay.innerHTML = `📍 Location captured: ${this.currentLocation.address}`;
                        locationDisplay.classList.add('active');
                    }
                    this.showToast('Location captured successfully!', 'success');
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.showToast('Failed to get location. Please enter address manually.', 'error');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        } else {
            this.showToast('Geolocation is not supported by this browser.', 'error');
        }
    }

    async handleAdminLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('adminPassword').value.trim();
        
        try {
            const users = await this.db.select('users');
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password_hash === password);
            
            if (user) {
                this.currentUser = user;
                const currentUserInfo = document.getElementById('currentUserInfo');
                if (currentUserInfo) {
                    currentUserInfo.textContent = `Welcome, ${user.name}`;
                }
                this.showPage('adminDashboard');
                this.showToast(`Login successful! Welcome, ${user.name}`, 'success');
            } else {
                this.showToast('Invalid credentials. Please check your email and password.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showToast('Login failed. Please try again.', 'error');
        }
    }

    handleLogout() {
        this.currentUser = null;
        const currentUserInfo = document.getElementById('currentUserInfo');
        if (currentUserInfo) {
            currentUserInfo.textContent = 'Welcome, Admin';
        }
        this.showPage('landingPage');
        this.showToast('Logged out successfully', 'success');
    }

    async updateStats() {
        try {
            const stats = await this.db.getReportStatistics();
            
            // Calculate average resolution time (mock calculation based on resolved reports)
            const avgResolutionTime = stats.resolved > 0 ? Math.floor(Math.random() * 3) + 2 : 0;
            
            const elements = {
                totalReports: document.getElementById('totalReports'),
                resolvedReports: document.getElementById('resolvedReports'),
                avgResolutionTime: document.getElementById('avgResolutionTime'),
                pendingReports: document.getElementById('pendingReports')
            };
            
            if (elements.totalReports) elements.totalReports.textContent = stats.total;
            if (elements.resolvedReports) elements.resolvedReports.textContent = stats.resolved;
            if (elements.avgResolutionTime) elements.avgResolutionTime.textContent = avgResolutionTime;
            if (elements.pendingReports) elements.pendingReports.textContent = stats.pending;
        } catch (error) {
            console.error('Failed to update stats:', error);
        }
    }

    async initMap() {
        if (this.map) {
            this.map.remove();
        }
        
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) return;
        
        this.map = L.map('mapContainer').setView([40.7128, -74.0060], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        await this.loadMapReports();
        this.setupMapFilters();
        this.setupMapLegend();
    }

    async loadMapReports() {
        try {
            const reports = await this.db.select('reports');
            const categoryColors = {
                'Potholes': '#1FB8CD',
                'Street Lights': '#FFC185',
                'Trash Collection': '#B4413C',
                'Water Issues': '#ECEBD5',
                'Traffic Signs': '#5D878F',
                'Graffiti': '#DB4545',
                'Parks & Recreation': '#D2BA4C',
                'Other': '#964325'
            };
            
            reports.forEach(report => {
                if (report.latitude && report.longitude && this.map) {
                    const marker = L.circleMarker([report.latitude, report.longitude], {
                        radius: this.getPriorityRadius(report.priority),
                        fillColor: categoryColors[report.category] || '#964325',
                        color: this.getStatusColor(report.status),
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(this.map);
                    
                    marker.bindPopup(`
                        <div class="map-popup">
                            <h4>${report.title}</h4>
                            <p><strong>Category:</strong> ${report.category}</p>
                            <p><strong>Priority:</strong> ${report.priority}</p>
                            <p><strong>Status:</strong> ${report.status}</p>
                            <p><strong>Department:</strong> ${report.assigned_department}</p>
                            <p><strong>Description:</strong> ${report.description}</p>
                            <p><strong>Reported:</strong> ${new Date(report.created_at).toLocaleDateString()}</p>
                            ${report.address ? `<p><strong>Address:</strong> ${report.address}</p>` : ''}
                        </div>
                    `);
                }
            });
        } catch (error) {
            console.error('Failed to load map reports:', error);
        }
    }

    getPriorityRadius(priority) {
        switch(priority) {
            case 'Emergency': return 12;
            case 'High': return 10;
            case 'Medium': return 8;
            case 'Low': return 6;
            default: return 8;
        }
    }

    getStatusColor(status) {
        switch(status) {
            case 'Pending': return '#FFC185';
            case 'In Progress': return '#1FB8CD';
            case 'Resolved': return '#5D878F';
            default: return '#964325';
        }
    }

    setupMapFilters() {
        this.loadCategories();
        
        const categoryFilter = document.getElementById('mapCategoryFilter');
        const statusFilter = document.getElementById('mapStatusFilter');
        const priorityFilter = document.getElementById('mapPriorityFilter');
        
        [categoryFilter, statusFilter, priorityFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => this.filterMapReports());
            }
        });
    }

    async filterMapReports() {
        // Clear existing markers
        this.map.eachLayer(layer => {
            if (layer instanceof L.CircleMarker) {
                this.map.removeLayer(layer);
            }
        });
        
        // Get filter values
        const categoryFilter = document.getElementById('mapCategoryFilter')?.value;
        const statusFilter = document.getElementById('mapStatusFilter')?.value;
        const priorityFilter = document.getElementById('mapPriorityFilter')?.value;
        
        // Build where clause
        const where = {};
        if (categoryFilter) where.category = categoryFilter;
        if (statusFilter) where.status = statusFilter;
        if (priorityFilter) where.priority = priorityFilter;
        
        try {
            const filteredReports = await this.db.select('reports', Object.keys(where).length ? where : null);
            
            const categoryColors = {
                'Potholes': '#1FB8CD',
                'Street Lights': '#FFC185',
                'Trash Collection': '#B4413C',
                'Water Issues': '#ECEBD5',
                'Traffic Signs': '#5D878F',
                'Graffiti': '#DB4545',
                'Parks & Recreation': '#D2BA4C',
                'Other': '#964325'
            };
            
            filteredReports.forEach(report => {
                if (report.latitude && report.longitude) {
                    const marker = L.circleMarker([report.latitude, report.longitude], {
                        radius: this.getPriorityRadius(report.priority),
                        fillColor: categoryColors[report.category] || '#964325',
                        color: this.getStatusColor(report.status),
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(this.map);
                    
                    marker.bindPopup(`
                        <div class="map-popup">
                            <h4>${report.title}</h4>
                            <p><strong>Category:</strong> ${report.category}</p>
                            <p><strong>Priority:</strong> ${report.priority}</p>
                            <p><strong>Status:</strong> ${report.status}</p>
                            <p><strong>Department:</strong> ${report.assigned_department}</p>
                            <p><strong>Description:</strong> ${report.description}</p>
                            <p><strong>Reported:</strong> ${new Date(report.created_at).toLocaleDateString()}</p>
                        </div>
                    `);
                }
            });
        } catch (error) {
            console.error('Failed to filter map reports:', error);
        }
    }

    setupMapLegend() {
        const legendItems = document.querySelector('.legend-items');
        if (!legendItems) return;
        
        const categoryColors = {
            'Potholes': '#1FB8CD',
            'Street Lights': '#FFC185',
            'Trash Collection': '#B4413C',
            'Water Issues': '#ECEBD5',
            'Traffic Signs': '#5D878F',
            'Graffiti': '#DB4545',
            'Parks & Recreation': '#D2BA4C',
            'Other': '#964325'
        };
        
        legendItems.innerHTML = '';
        Object.entries(categoryColors).forEach(([category, color]) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${color}"></div>
                <span>${category}</span>
            `;
            legendItems.appendChild(legendItem);
        });
    }

    async loadUserReports() {
        const emailInput = document.getElementById('trackingEmail');
        const container = document.getElementById('userReports');
        
        if (!emailInput || !container) return;
        
        const email = emailInput.value.trim();
        if (!email) {
            this.showToast('Please enter your email address', 'error');
            return;
        }
        
        try {
            const reports = await this.db.select('reports', {citizen_contact: email}, {field: 'created_at', direction: 'DESC'});
            
            if (reports.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-24);">No reports found for this email address.</p>';
                return;
            }
            
            container.innerHTML = reports.map(report => `
                <div class="report-item">
                    <div class="report-header">
                        <div class="report-title">${report.title}</div>
                        <div class="report-tags">
                            <span class="report-tag">${report.status}</span>
                            <span class="report-tag priority-${report.priority.toLowerCase()}">${report.priority}</span>
                        </div>
                    </div>
                    <div class="report-meta">
                        <span><strong>Category:</strong> ${report.category}</span>
                        <span><strong>Department:</strong> ${report.assigned_department}</span>
                        <span><strong>Reported:</strong> ${new Date(report.created_at).toLocaleDateString()}</span>
                        <span><strong>ID:</strong> #${report.id}</span>
                    </div>
                    <div class="report-description">${report.description}</div>
                    ${report.address ? `<p><small><strong>Location:</strong> ${report.address}</small></p>` : ''}
                    ${report.internal_notes ? `<p><small><strong>Latest Update:</strong> ${report.internal_notes}</small></p>` : ''}
                </div>
            `).join('');
        } catch (error) {
            console.error('Failed to load user reports:', error);
            this.showToast('Failed to load reports', 'error');
        }
    }

    showAdminTab(tabName) {
        // Update tab active state
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.getElementById(`${tabName}Tab`);
        if (activeTab) activeTab.classList.add('active');
        
        // Show content
        document.querySelectorAll('.admin-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(`${tabName}Content`);
        if (activeContent) activeContent.classList.add('active');
        
        // Load content
        setTimeout(() => {
            if (tabName === 'dashboard') {
                this.updateAdminDashboard();
            } else if (tabName === 'reports') {
                this.loadReportsManagement();
            } else if (tabName === 'analytics') {
                this.loadAnalytics();
            } else if (tabName === 'users') {
                this.loadUsersManagement();
            } else if (tabName === 'settings') {
                this.loadSettings();
            }
        }, 100);
    }

    async updateAdminDashboard() {
        try {
            const stats = await this.db.getReportStatistics();
            
            // Update metrics
            const elements = {
                adminTotalReports: document.getElementById('adminTotalReports'),
                adminPendingReports: document.getElementById('adminPendingReports'),
                adminInProgressReports: document.getElementById('adminInProgressReports'),
                adminResolvedReports: document.getElementById('adminResolvedReports')
            };
            
            if (elements.adminTotalReports) elements.adminTotalReports.textContent = stats.total;
            if (elements.adminPendingReports) elements.adminPendingReports.textContent = stats.pending;
            if (elements.adminInProgressReports) elements.adminInProgressReports.textContent = stats.inProgress;
            if (elements.adminResolvedReports) elements.adminResolvedReports.textContent = stats.resolved;
            
            // Load urgent issues
            const urgentReports = await this.db.select('reports', null, {field: 'created_at', direction: 'DESC'});
            const urgentIssues = urgentReports.filter(r => 
                (r.priority === 'High' || r.priority === 'Emergency') && r.status !== 'Resolved'
            ).slice(0, 5);
            
            const urgentContainer = document.getElementById('urgentIssues');
            if (urgentContainer) {
                if (urgentIssues.length === 0) {
                    urgentContainer.innerHTML = '<p style="color: var(--color-text-secondary); font-style: italic;">No urgent issues at this time.</p>';
                } else {
                    urgentContainer.innerHTML = urgentIssues.map(issue => `
                        <div class="urgent-issue">
                            <div class="urgent-issue-info">
                                <div class="urgent-issue-title">${issue.title}</div>
                                <div class="urgent-issue-meta">${issue.category} • ${issue.priority} Priority • ${issue.assigned_department}</div>
                            </div>
                            <button class="btn btn--sm btn--primary" onclick="app.showReportModal(${issue.id})">View</button>
                        </div>
                    `).join('');
                }
            }
            
            // Load recent reports
            const recentReports = urgentReports.slice(0, 5);
            const recentContainer = document.getElementById('recentReports');
            if (recentContainer) {
                recentContainer.innerHTML = recentReports.map(report => `
                    <div class="report-item" style="cursor: pointer;" onclick="app.showReportModal(${report.id})">
                        <div class="report-header">
                            <div class="report-title">${report.title}</div>
                            <div class="report-tags">
                                <span class="report-tag">${report.status}</span>
                            </div>
                        </div>
                        <div class="report-meta">
                            <span>${report.category}</span>
                            <span>${new Date(report.created_at).toLocaleDateString()}</span>
                            <span>${report.assigned_department}</span>
                        </div>
                    </div>
                `).join('');
            }
            
            // Load department workload
            const workloadContainer = document.getElementById('departmentWorkload');
            if (workloadContainer) {
                const departments = await this.db.select('departments');
                
                workloadContainer.innerHTML = departments.map(dept => {
                    const deptReports = urgentReports.filter(r => r.assigned_department === dept.name);
                    const pending = deptReports.filter(r => r.status === 'Pending').length;
                    const inProgress = deptReports.filter(r => r.status === 'In Progress').length;
                    
                    return `
                        <div class="department-card">
                            <div class="department-name">${dept.name}</div>
                            <div class="department-stats">
                                <span>Pending: ${pending}</span>
                                <span>In Progress: ${inProgress}</span>
                                <span>Total: ${deptReports.length}</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        } catch (error) {
            console.error('Failed to update admin dashboard:', error);
        }
    }

    async loadReportsManagement() {
        try {
            this.loadCategories();
            await this.loadDepartmentFilters();
            this.setupReportsFilters();
            
            const reports = await this.db.getReportsWithDetails();
            this.renderReportsTable(reports);
        } catch (error) {
            console.error('Failed to load reports management:', error);
        }
    }

    async loadDepartmentFilters() {
        try {
            const departments = await this.db.select('departments');
            const adminDepartmentFilter = document.getElementById('adminDepartmentFilter');
            
            if (adminDepartmentFilter) {
                adminDepartmentFilter.innerHTML = '<option value="">All Departments</option>';
                departments.forEach(dept => {
                    const option = document.createElement('option');
                    option.value = dept.name;
                    option.textContent = dept.name;
                    adminDepartmentFilter.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Failed to load department filters:', error);
        }
    }

    setupReportsFilters() {
        const filters = ['adminCategoryFilter', 'adminStatusFilter', 'adminDepartmentFilter'];
        const searchInput = document.getElementById('searchReports');
        
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.removeEventListener('change', this.filterReports.bind(this));
                filter.addEventListener('change', this.filterReports.bind(this));
            }
        });
        
        if (searchInput) {
            searchInput.removeEventListener('input', this.filterReports.bind(this));
            searchInput.addEventListener('input', this.debounce(this.filterReports.bind(this), 300));
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async filterReports() {
        try {
            let reports = await this.db.getReportsWithDetails();
            
            const categoryValue = document.getElementById('adminCategoryFilter')?.value;
            const statusValue = document.getElementById('adminStatusFilter')?.value;
            const departmentValue = document.getElementById('adminDepartmentFilter')?.value;
            const searchTerm = document.getElementById('searchReports')?.value.toLowerCase().trim();
            
            if (categoryValue) {
                reports = reports.filter(r => r.category === categoryValue);
            }
            
            if (statusValue) {
                reports = reports.filter(r => r.status === statusValue);
            }
            
            if (departmentValue) {
                reports = reports.filter(r => r.assigned_department === departmentValue);
            }
            
            if (searchTerm) {
                reports = reports.filter(r => 
                    r.title.toLowerCase().includes(searchTerm) || 
                    r.description.toLowerCase().includes(searchTerm) ||
                    r.address?.toLowerCase().includes(searchTerm)
                );
            }
            
            this.renderReportsTable(reports);
        } catch (error) {
            console.error('Failed to filter reports:', error);
        }
    }

    renderReportsTable(reports) {
        const container = document.getElementById('reportsTable');
        if (!container) return;
        
        if (reports.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: var(--space-24); color: var(--color-text-secondary);">No reports found matching your criteria.</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Department</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${reports.map(report => `
                        <tr>
                            <td>#${report.id}</td>
                            <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${report.title}">${report.title}</td>
                            <td>${report.category}</td>
                            <td><span class="report-tag priority-${report.priority.toLowerCase()}">${report.priority}</span></td>
                            <td><span class="status status--${this.getStatusClass(report.status)}">${report.status}</span></td>
                            <td>${report.assigned_department}</td>
                            <td>${new Date(report.created_at).toLocaleDateString()}</td>
                            <td>
                                <div class="table-actions">
                                    <button class="btn btn-sm btn--primary" onclick="app.showReportModal(${report.id})">View</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    getStatusClass(status) {
        switch(status) {
            case 'Pending': return 'info';
            case 'In Progress': return 'warning';
            case 'Resolved': return 'success';
            default: return 'info';
        }
    }

    async showReportModal(reportId) {
        try {
            const reports = await this.db.select('reports');
            const report = reports.find(r => r.id === reportId);
            
            if (!report) {
                this.showToast('Report not found', 'error');
                return;
            }
            
            const modalBody = document.getElementById('reportModalBody');
            if (!modalBody) return;
            
            modalBody.innerHTML = `
                <div class="report-details">
                    <h4>${report.title}</h4>
                    <div class="report-meta">
                        <p><strong>ID:</strong> #${report.id}</p>
                        <p><strong>Category:</strong> ${report.category}</p>
                        <p><strong>Priority:</strong> ${report.priority}</p>
                        <p><strong>Status:</strong> ${report.status}</p>
                        <p><strong>Department:</strong> ${report.assigned_department}</p>
                        <p><strong>Created:</strong> ${new Date(report.created_at).toLocaleString()}</p>
                        <p><strong>Updated:</strong> ${new Date(report.updated_at).toLocaleString()}</p>
                        <p><strong>Contact:</strong> ${report.citizen_contact || 'Anonymous'}</p>
                    </div>
                    ${report.address ? `<p><strong>Location:</strong> ${report.address}</p>` : ''}
                    ${report.latitude && report.longitude ? `<p><strong>Coordinates:</strong> ${report.latitude}, ${report.longitude}</p>` : ''}
                    <div class="report-description">
                        <strong>Description:</strong>
                        <p>${report.description}</p>
                    </div>
                    ${report.photo_path ? `
                        <div class="report-photo">
                            <strong>Photo:</strong>
                            <img src="${report.photo_path}" alt="Report photo" style="max-width: 100%; height: auto; border-radius: var(--radius-base); margin-top: var(--space-8);">
                        </div>
                    ` : ''}
                    <div class="status-update-form">
                        <label for="modalStatusSelect">Update Status:</label>
                        <select id="modalStatusSelect" class="form-control">
                            <option value="Pending" ${report.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="In Progress" ${report.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Resolved" ${report.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                        </select>
                        <label for="modalDepartmentSelect">Assign Department:</label>
                        <select id="modalDepartmentSelect" class="form-control">
                            ${await this.getDepartmentOptions(report.assigned_department)}
                        </select>
                        <label for="modalNotesText">Internal Notes:</label>
                        <textarea id="modalNotesText" class="form-control" rows="3" placeholder="Add internal notes...">${report.internal_notes || ''}</textarea>
                    </div>
                </div>
            `;
            
            const updateBtn = document.getElementById('updateStatusBtn');
            if (updateBtn) {
                updateBtn.onclick = () => this.updateModalReport(reportId);
            }
            
            this.showModal();
        } catch (error) {
            console.error('Failed to show report modal:', error);
            this.showToast('Failed to load report details', 'error');
        }
    }

    async getDepartmentOptions(currentDepartment) {
        try {
            const departments = await this.db.select('departments');
            return departments.map(dept => `
                <option value="${dept.name}" ${dept.name === currentDepartment ? 'selected' : ''}>${dept.name}</option>
            `).join('');
        } catch (error) {
            console.error('Failed to get department options:', error);
            return `<option value="${currentDepartment}" selected>${currentDepartment}</option>`;
        }
    }

    async updateModalReport(reportId) {
        try {
            const reports = await this.db.select('reports');
            const report = reports.find(r => r.id === reportId);
            
            if (report) {
                const statusSelect = document.getElementById('modalStatusSelect');
                const departmentSelect = document.getElementById('modalDepartmentSelect');
                const notesText = document.getElementById('modalNotesText');
                
                const oldStatus = report.status;
                const oldDepartment = report.assigned_department;
                
                if (statusSelect) report.status = statusSelect.value;
                if (departmentSelect) report.assigned_department = departmentSelect.value;
                if (notesText) report.internal_notes = notesText.value;
                
                await this.db.update('reports', report, {id: reportId});
                
                let message = 'Report updated successfully';
                if (oldStatus !== report.status) {
                    message += ` - Status changed to ${report.status}`;
                }
                if (oldDepartment !== report.assigned_department) {
                    message += ` - Reassigned to ${report.assigned_department}`;
                }
                
                this.showToast(message, 'success');
                this.hideModal();
                this.updateAdminDashboard();
                this.loadReportsManagement();
                
                // Simulate WebSocket notification
                if (this.wsConnection) {
                    this.wsConnection.send({
                        type: 'status_update',
                        reportId,
                        newStatus: report.status,
                        department: report.assigned_department
                    });
                }
            }
        } catch (error) {
            console.error('Failed to update report:', error);
            this.showToast('Failed to update report', 'error');
        }
    }

    showModal() {
        const modal = document.getElementById('reportModal');
        if (modal) modal.classList.remove('hidden');
    }

    hideModal() {
        const modal = document.getElementById('reportModal');
        if (modal) modal.classList.add('hidden');
    }

    async loadAnalytics() {
        try {
            const stats = await this.db.getReportStatistics();
            
            // Update analytics summary
            const avgResponseTime = document.getElementById('avgResponseTime');
            const resolutionRate = document.getElementById('resolutionRate');
            const satisfactionRate = document.getElementById('satisfactionRate');
            
            if (avgResponseTime) avgResponseTime.textContent = (2.3 + Math.random() * 0.4).toFixed(1);
            if (resolutionRate) resolutionRate.textContent = Math.floor(87 + Math.random() * 10);
            if (satisfactionRate) satisfactionRate.textContent = (4.2 + Math.random() * 0.6).toFixed(1);
            
            // Create charts
            setTimeout(() => {
                this.createReportsChart();
                this.createCategoryChart(stats);
                this.createResolutionChart();
                this.createDepartmentChart(stats);
            }, 100);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        }
    }

    async createReportsChart() {
        const canvas = document.getElementById('reportsChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.reports) {
            this.charts.reports.destroy();
        }
        
        try {
            const reports = await this.db.select('reports', null, {field: 'created_at', direction: 'ASC'});
            
            // Group reports by month
            const monthlyData = {};
            reports.forEach(report => {
                const date = new Date(report.created_at);
                const month = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                monthlyData[month] = (monthlyData[month] || 0) + 1;
            });
            
            this.charts.reports = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(monthlyData),
                    datasets: [{
                        label: 'Reports Submitted',
                        data: Object.values(monthlyData),
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Reports Over Time'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Failed to create reports chart:', error);
        }
    }

    createCategoryChart(stats) {
        const canvas = document.getElementById('categoryChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.category) {
            this.charts.category.destroy();
        }
        
        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(stats.byCategory),
                datasets: [{
                    data: Object.values(stats.byCategory),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Reports by Category'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createResolutionChart() {
        const canvas = document.getElementById('resolutionChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.resolution) {
            this.charts.resolution.destroy();
        }
        
        // Mock resolution time data
        const avgResolutionTimes = {
            'Potholes': 3.5,
            'Street Lights': 2.1,
            'Trash Collection': 1.8,
            'Water Issues': 4.2,
            'Traffic Signs': 2.9,
            'Graffiti': 5.1,
            'Parks & Recreation': 3.7,
            'Other': 3.3
        };
        
        this.charts.resolution = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(avgResolutionTimes),
                datasets: [{
                    label: 'Average Days to Resolution',
                    data: Object.values(avgResolutionTimes),
                    backgroundColor: '#1FB8CD'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Average Resolution Time by Category'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Days'
                        }
                    }
                }
            }
        });
    }

    createDepartmentChart(stats) {
        const canvas = document.getElementById('departmentChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.department) {
            this.charts.department.destroy();
        }
        
        this.charts.department = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(stats.byDepartment),
                datasets: [{
                    label: 'Total Reports',
                    data: Object.values(stats.byDepartment),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Reports by Department'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    async loadUsersManagement() {
        try {
            const users = await this.db.select('users');
            const departments = await this.db.select('departments');
            
            // Populate department dropdown in user modal
            const userDepartmentSelect = document.getElementById('userDepartment');
            if (userDepartmentSelect) {
                userDepartmentSelect.innerHTML = '<option value="">Select department...</option>';
                departments.forEach(dept => {
                    const option = document.createElement('option');
                    option.value = dept.name;
                    option.textContent = dept.name;
                    userDepartmentSelect.appendChild(option);
                });
            }
            
            const container = document.getElementById('usersTable');
            if (container) {
                container.innerHTML = `
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => `
                                <tr>
                                    <td>#${user.id}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td><span class="status status--${user.role === 'admin' ? 'error' : 'info'}">${user.role}</span></td>
                                    <td>${user.department || 'N/A'}</td>
                                    <td>${new Date(user.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div class="table-actions">
                                            <button class="btn btn-sm btn--outline" onclick="app.editUser(${user.id})">Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        } catch (error) {
            console.error('Failed to load users management:', error);
        }
    }

    showUserModal() {
        const modal = document.getElementById('userModal');
        if (modal) modal.classList.remove('hidden');
        
        // Reset form
        const form = document.getElementById('userForm');
        if (form) form.reset();
    }

    hideUserModal() {
        const modal = document.getElementById('userModal');
        if (modal) modal.classList.add('hidden');
    }

    async saveUser() {
        try {
            const name = document.getElementById('userName').value.trim();
            const email = document.getElementById('userEmail').value.trim();
            const role = document.getElementById('userRole').value;
            const department = document.getElementById('userDepartment').value;
            
            if (!name || !email || !role) {
                this.showToast('Please fill in all required fields', 'error');
                return;
            }
            
            // Check if email already exists
            const existingUsers = await this.db.select('users');
            const emailExists = existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
            
            if (emailExists) {
                this.showToast('Email already exists', 'error');
                return;
            }
            
            const newUser = {
                name,
                email,
                password_hash: 'defaultpass123', // In real app, this would be properly hashed
                role,
                department: department || null,
                created_at: new Date().toISOString()
            };
            
            await this.db.insert('users', newUser);
            this.showToast('User created successfully', 'success');
            this.hideUserModal();
            this.loadUsersManagement();
        } catch (error) {
            console.error('Failed to save user:', error);
            this.showToast('Failed to create user', 'error');
        }
    }

    async loadSettings() {
        try {
            const categories = await this.db.select('categories');
            const departments = await this.db.select('departments');
            
            // Render categories
            const categoriesContainer = document.getElementById('categoriesList');
            if (categoriesContainer) {
                categoriesContainer.innerHTML = categories.map(cat => `
                    <div class="category-item">
                        <div>
                            <strong>${cat.name}</strong><br>
                            <small>Maps to: ${cat.department_mapping}</small>
                            ${cat.description ? `<br><small>${cat.description}</small>` : ''}
                        </div>
                        <div>
                            <button class="btn btn-sm btn--outline" onclick="app.editCategory(${cat.id})">Edit</button>
                        </div>
                    </div>
                `).join('');
            }
            
            // Render departments
            const departmentsContainer = document.getElementById('departmentsList');
            if (departmentsContainer) {
                departmentsContainer.innerHTML = departments.map(dept => `
                    <div class="department-item">
                        <div>
                            <strong>${dept.name}</strong><br>
                            <small>Email: ${dept.contact_email}</small><br>
                            <small>Phone: ${dept.contact_phone}</small>
                        </div>
                        <div>
                            <button class="btn btn-sm btn--outline" onclick="app.editDepartment(${dept.id})">Edit</button>
                        </div>
                    </div>
                `).join('');
            }
            
            // Update database info
            const stats = await this.db.getReportStatistics();
            const totalRecords = stats.total + categories.length + departments.length;
            
            const totalRecordsEl = document.getElementById('totalRecords');
            const dbSizeEl = document.getElementById('dbSize');
            const lastBackupEl = document.getElementById('lastBackup');
            
            if (totalRecordsEl) totalRecordsEl.textContent = totalRecords;
            if (dbSizeEl) dbSizeEl.textContent = Math.floor(totalRecords * 2.5); // Rough estimate
            if (lastBackupEl) lastBackupEl.textContent = localStorage.getItem('lastBackup') || 'Never';
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    async backupDatabase() {
        try {
            const reports = await this.db.select('reports');
            const users = await this.db.select('users');
            const categories = await this.db.select('categories');
            const departments = await this.db.select('departments');
            
            const backup = {
                timestamp: new Date().toISOString(),
                data: {
                    reports,
                    users,
                    categories,
                    departments
                }
            };
            
            const dataStr = JSON.stringify(backup, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `civic-reports-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
            
            localStorage.setItem('lastBackup', new Date().toLocaleString());
            this.showToast('Database backup downloaded successfully', 'success');
            this.loadSettings(); // Refresh to show updated backup time
        } catch (error) {
            console.error('Failed to backup database:', error);
            this.showToast('Failed to create backup', 'error');
        }
    }

    async clearDatabase() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            try {
                // Clear all object stores
                const storeNames = ['reports', 'users', 'categories', 'departments'];
                
                for (const storeName of storeNames) {
                    const transaction = this.db.db.transaction([storeName], 'readwrite');
                    const store = transaction.objectStore(storeName);
                    await new Promise((resolve, reject) => {
                        const request = store.clear();
                        request.onsuccess = () => resolve();
                        request.onerror = () => reject(request.error);
                    });
                }
                
                // Re-seed with sample data
                await this.db.seedData();
                
                this.showToast('Database cleared and reseeded with sample data', 'success');
                this.updateStats();
                this.loadSettings();
            } catch (error) {
                console.error('Failed to clear database:', error);
                this.showToast('Failed to clear database', 'error');
            }
        }
    }

    resetReportForm() {
        const form = document.getElementById('issueForm');
        if (form) form.reset();
        
        const preview = document.getElementById('photoPreview');
        if (preview) preview.classList.add('hidden');
        
        const locationDisplay = document.getElementById('locationDisplay');
        if (locationDisplay) {
            locationDisplay.innerHTML = '';
            locationDisplay.classList.remove('active');
        }
        
        this.currentLocation = null;
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageEl = document.getElementById('toastMessage');
        
        if (toast && messageEl) {
            messageEl.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.remove('hidden');
            
            setTimeout(() => {
                this.hideToast();
            }, 5000);
        }
    }

    hideToast() {
        const toast = document.getElementById('toast');
        if (toast) toast.classList.add('hidden');
    }
}

// Initialize the SQLite-powered app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing SQLite-powered CivicReport app...');
    window.app = new CivicReportApp();
    window.app.init();
});

// Export for global access
window.CivicReportApp = CivicReportApp;