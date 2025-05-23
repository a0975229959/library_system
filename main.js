// script.js - 圖書管理系統 JavaScript 邏輯

class BookManagementSystem {
    constructor() {
        this.books = [];
        this.currentView = 'grid';
        this.currentPage = 1;
        this.booksPerPage = 12;
        this.filteredBooks = [];
        this.editingBookId = null;
        
        // 初始化系統
        this.init();
    }

    // 初始化系統
    init() {
        this.loadSampleData();
        this.bindEvents();
        this.updateStats();
        this.renderRecentBooks();
        this.renderBooks();
        this.populateCategoryFilter();
        
        // 顯示載入完成通知
        setTimeout(() => {
            this.showNotification('系統載入完成！', 'success');
        }, 500);
    }

    // 載入範例資料
    loadSampleData() {
        const sampleBooks = [
            {
                id: 1,
                title: "Vue.js 3 完全開發指南",
                author: "陳建志",
                category: "程式設計",
                description: "深入探討 Vue.js 3 的 Composition API、響應式系統、組件設計模式，以及現代前端開發的最佳實踐。包含大量實戰案例和進階技巧，是前端開發者必備的學習資源。",
                price: 680,
                publishDate: "2024-03-15",
                isbn: "978-986-123-456-7",
                pages: 520,
                cover: "📚",
                addedDate: new Date('2024-03-15')
            },
            {
                id: 2,
                title: "JavaScript 深度解析",
                author: "王美玲",
                category: "程式設計",
                description: "從基礎到進階，全面解析 JavaScript 核心概念。涵蓋 ES6+新特性、異步程式設計、函數式程式設計和效能優化，幫助開發者建立堅實的 JavaScript 基礎。",
                price: 590,
                publishDate: "2024-01-20",
                isbn: "978-986-789-123-4",
                pages: 450,
                cover: "💻",
                addedDate: new Date('2024-01-20')
            },
            {
                id: 3,
                title: "人工智慧的未來",
                author: "李志明",
                category: "科學技術",
                description: "探討人工智慧技術的發展趨勢與未來展望。從機器學習到深度學習，從自然語言處理到電腦視覺，全面解析 AI 技術的應用與挑戰。",
                price: 720,
                publishDate: "2023-11-10",
                isbn: "978-986-456-789-1",
                pages: 600,
                cover: "🤖",
                addedDate: new Date('2023-11-10')
            },
            {
                id: 4,
                title: "設計思維與創新",
                author: "張惠文",
                category: "藝術設計",
                description: "介紹設計思維的核心概念與實踐方法。從使用者研究到原型製作，從創意發想到解決方案，是設計師和產品經理的實用指南。",
                price: 550,
                publishDate: "2024-02-05",
                isbn: "978-986-321-654-8",
                pages: 380,
                cover: "🎨",
                addedDate: new Date('2024-02-05')
            },
            {
                id: 5,
                title: "投資理財致富術",
                author: "劉建國",
                category: "商業理財",
                description: "分享實用的投資理財策略與技巧。從基礎理財觀念到進階投資方法，幫助讀者建立正確的財富管理思維，實現財務自由目標。",
                price: 480,
                publishDate: "2024-04-12",
                isbn: "978-986-654-321-5",
                pages: 420,
                cover: "💰",
                addedDate: new Date('2024-04-12')
            },
            {
                id: 6,
                title: "心理學與生活",
                author: "許雅婷",
                category: "心理勵志",
                description: "運用心理學原理改善日常生活品質。從認知心理學到社會心理學，從情緒管理到人際關係，提供科學的生活改善方法。",
                price: 420,
                publishDate: "2023-12-18",
                isbn: "978-986-987-654-2",
                pages: 350,
                cover: "🧠",
                addedDate: new Date('2023-12-18')
            },
            {
                id: 7,
                title: "世界文學經典",
                author: "林美華",
                category: "文學小說",
                description: "精選世界文學經典作品，深度解析文學巨匠的創作技巧與思想內涵。從古典文學到現代文學，豐富讀者的文學素養。",
                price: 650,
                publishDate: "2024-01-30",
                isbn: "978-986-111-222-3",
                pages: 580,
                cover: "📖",
                addedDate: new Date('2024-01-30')
            },
            {
                id: 8,
                title: "歷史的轉折點",
                author: "陳志偉",
                category: "歷史傳記",
                description: "回顧人類歷史上的重要轉折點，從政治變革到科技革命，從文化交流到社會變遷，深入理解歷史發展的脈絡與影響。",
                price: 580,
                publishDate: "2023-10-25",
                isbn: "978-986-333-444-5",
                pages: 480,
                cover: "📜",
                addedDate: new Date('2023-10-25')
            }
        ];

        // 從 localStorage 載入資料，如果沒有則使用範例資料
        const savedBooks = localStorage.getItem('books');
        if (savedBooks) {
            this.books = JSON.parse(savedBooks).map(book => ({
                ...book,
                addedDate: new Date(book.addedDate)
            }));
        } else {
            this.books = sampleBooks;
            this.saveToLocalStorage();
        }
    }

    // 儲存到 localStorage
    saveToLocalStorage() {
        localStorage.setItem('books', JSON.stringify(this.books));
    }

    // 綁定事件監聽器
    bindEvents() {
        // 導航事件
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // 手機導航切換
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('show');
            });
        }

        // 搜尋功能
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
                searchClear.style.display = e.target.value ? 'block' : 'none';
            });
        }
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                this.handleSearch('');
                searchClear.style.display = 'none';
            });
        }

        // 篩選功能
        const categoryFilter = document.getElementById('categoryFilter');
        const sortBy = document.getElementById('sortBy');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }
        if (sortBy) {
            sortBy.addEventListener('change', () => this.applyFilters());
        }

        // 視圖切換
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // 表單事件
        const bookForm = document.getElementById('bookForm');
        if (bookForm) {
            bookForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // 字數統計
        const bookDescription = document.getElementById('bookDescription');
        if (bookDescription) {
            bookDescription.addEventListener('input', (e) => {
                this.updateCharCount(e.target.value.length);
            });
        }

        // 模態框事件
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                    this.closeDeleteModal();
                }
            });
        });

        // ESC 鍵關閉模態框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeDeleteModal();
            }
        });

        // 通知關閉
        const notificationClose = document.querySelector('.notification-close');
        if (notificationClose) {
            notificationClose.addEventListener('click', () => {
                this.hideNotification();
            });
        }
    }

    // 顯示指定區段
    showSection(sectionName) {
        // 隱藏所有區段
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });

        // 顯示指定區段
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // 更新導航狀態
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');

        // 特定區段的處理
        if (sectionName === 'books') {
            this.renderBooks();
        } else if (sectionName === 'dashboard') {
            this.updateStats();
            this.renderRecentBooks();
        } else if (sectionName === 'add-book') {
            this.resetForm();
        }
    }

    // 更新統計資料
    updateStats() {
        const totalBooks = this.books.length;
        const categories = [...new Set(this.books.map(book => book.category))];
        const totalCategories = categories.length;
        const totalPages = this.books.reduce((sum, book) => sum + (book.pages || 0), 0);
        const avgPrice = totalBooks > 0 ? Math.round(this.books.reduce((sum, book) => sum + (book.price || 0), 0) / totalBooks) : 0;

        // 更新 DOM
        this.updateElement('totalBooks', totalBooks.toLocaleString());
        this.updateElement('totalCategories', totalCategories);
        this.updateElement('totalPages', totalPages.toLocaleString());
        this.updateElement('avgPrice', `NT$ ${avgPrice.toLocaleString()}`);
    }

    // 渲染最新書籍
    renderRecentBooks() {
        const recentBooksContainer = document.getElementById('recentBooks');
        if (!recentBooksContainer) return;

        const recentBooks = [...this.books]
            .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
            .slice(0, 3);

        if (recentBooks.length === 0) {
            recentBooksContainer.innerHTML = `
                <div class="empty-state">
                    <p>尚無書籍資料</p>
                    <button class="btn btn-primary" onclick="bookSystem.showSection('add-book')">
                        <i class="fas fa-plus"></i>
                        新增第一本書
                    </button>
                </div>
            `;
            return;
        }

        recentBooksContainer.innerHTML = recentBooks.map(book => `
            <div class="book-card" onclick="bookSystem.showBookDetail(${book.id})">
                <div class="book-cover">${book.cover || '📚'}</div>
                <h3 class="book-title">${this.escapeHtml(book.title)}</h3>
                <p class="book-author">
                    <i class="fas fa-user"></i>
                    ${this.escapeHtml(book.author)}
                </p>
                <span class="book-category">${this.escapeHtml(book.category)}</span>
                <p class="book-description">${this.escapeHtml(book.description)}</p>
                <div class="book-price">
                    <i class="fas fa-tag"></i>
                    NT$ ${book.price?.toLocaleString() || '0'}
                </div>
            </div>
        `).join('');
    }

    // 處理搜尋
    handleSearch(query) {
        this.applyFilters();
    }

    // 應用篩選和排序
    applyFilters() {
        const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const sortBy = document.getElementById('sortBy')?.value || 'title';

        // 篩選書籍
        this.filteredBooks = this.books.filter(book => {
            const matchesSearch = !searchQuery || 
                book.title.toLowerCase().includes(searchQuery) ||
                book.author.toLowerCase().includes(searchQuery) ||
                book.description.toLowerCase().includes(searchQuery);
            
            const matchesCategory = !categoryFilter || book.category === categoryFilter;
            
            return matchesSearch && matchesCategory;
        });

        // 排序書籍
        this.filteredBooks.sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'author':
                    return a.author.localeCompare(b.author);
                case 'date':
                    return new Date(b.publishDate || 0) - new Date(a.publishDate || 0);
                case 'price':
                    return (b.price || 0) - (a.price || 0);
                default:
                    return 0;
            }
        });

        this.currentPage = 1;
        this.renderBooks();
    }

    // 渲染書籍列表
    renderBooks() {
        const booksGrid = document.getElementById('booksGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (!booksGrid || !emptyState) return;

        // 如果沒有篩選結果，使用所有書籍
        if (this.filteredBooks.length === 0 && document.getElementById('searchInput')?.value === '' && document.getElementById('categoryFilter')?.value === '') {
            this.filteredBooks = [...this.books];
        }

        // 計算分頁
        const startIndex = (this.currentPage - 1) * this.booksPerPage;
        const endIndex = startIndex + this.booksPerPage;
        const paginatedBooks = this.filteredBooks.slice(startIndex, endIndex);

        // 顯示或隱藏空狀態
        if (this.filteredBooks.length === 0) {
            booksGrid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        } else {
            booksGrid.style.display = 'grid';
            emptyState.style.display = 'none';
        }

        // 設置網格樣式
        booksGrid.className = `books-grid ${this.currentView === 'list' ? 'list-view' : ''}`;

        // 渲染書籍卡片
        booksGrid.innerHTML = paginatedBooks.map(book => {
            if (this.currentView === 'list') {
                return this.createBookListItem(book);
            } else {
                return this.createBookCard(book);
            }
        }).join('');

        // 渲染分頁
        this.renderPagination();
    }

    // 建立書籍卡片
    createBookCard(book) {
        return `
            <div class="book-card" onclick="bookSystem.showBookDetail(${book.id})">
                <div class="book-cover">${book.cover || '📚'}</div>
                <h3 class="book-title">${this.escapeHtml(book.title)}</h3>
                <p class="book-author">
                    <i class="fas fa-user"></i>
                    ${this.escapeHtml(book.author)}
                </p>
                <span class="book-category">${this.escapeHtml(book.category || '未分類')}</span>
                <p class="book-description">${this.escapeHtml(book.description)}</p>
                <div class="book-price">
                    <i class="fas fa-tag"></i>
                    NT$ ${book.price?.toLocaleString() || '0'}
                </div>
                <div class="book-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); bookSystem.showBookDetail(${book.id})">
                        <i class="fas fa-eye"></i>
                        查看
                    </button>
                    <button class="btn btn-success" onclick="event.stopPropagation(); bookSystem.editBook(${book.id})">
                        <i class="fas fa-edit"></i>
                        編輯
                    </button>
                    <button class="btn btn-danger" onclick="event.stopPropagation(); bookSystem.confirmDeleteBook(${book.id})">
                        <i class="fas fa-trash"></i>
                        刪除
                    </button>
                </div>
            </div>
        `;
    }

    // 建立書籍列表項目
    createBookListItem(book) {
        return `
            <div class="book-card list-view" onclick="bookSystem.showBookDetail(${book.id})">
                <div class="book-cover">${book.cover || '📚'}</div>
                <div class="book-info">
                    <h3 class="book-title">${this.escapeHtml(book.title)}</h3>
                    <p class="book-author">
                        <i class="fas fa-user"></i>
                        ${this.escapeHtml(book.author)}
                    </p>
                    <span class="book-category">${this.escapeHtml(book.category || '未分類')}</span>
                    <p class="book-description">${this.escapeHtml(book.description)}</p>
                    <div class="book-price">
                        <i class="fas fa-tag"></i>
                        NT$ ${book.price?.toLocaleString() || '0'}
                    </div>
                </div>
                <div class="book-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); bookSystem.showBookDetail(${book.id})">
                        <i class="fas fa-eye"></i>
                        查看
                    </button>
                    <button class="btn btn-success" onclick="event.stopPropagation(); bookSystem.editBook(${book.id})">
                        <i class="fas fa-edit"></i>
                        編輯
                    </button>
                    <button class="btn btn-danger" onclick="event.stopPropagation(); bookSystem.confirmDeleteBook(${book.id})">
                        <i class="fas fa-trash"></i>
                        刪除
                    </button>
                </div>
            </div>
        `;
    }

    // 渲染分頁
    renderPagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredBooks.length / this.booksPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHtml = '';

        // 上一頁按鈕
        paginationHtml += `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="bookSystem.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // 頁碼按鈕
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHtml += `
                    <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                            onclick="bookSystem.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHtml += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        // 下一頁按鈕
        paginationHtml += `
            <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="bookSystem.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        paginationContainer.innerHTML = paginationHtml;
    }

    // 跳轉到指定頁面
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredBooks.length / this.booksPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderBooks();
            // 滾動到頂部
            document.querySelector('.books-container').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // 切換視圖模式
    switchView(view) {
        this.currentView = view;
        
        // 更新按鈕狀態
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // 重新渲染書籍
        this.renderBooks();
    }

    // 填充分類篩選器
    populateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;

        const categories = [...new Set(this.books.map(book => book.category))].sort();
        
        // 保留第一個選項 "所有分類"
        const currentOptions = Array.from(categoryFilter.options).slice(1);
        currentOptions.forEach(option => option.remove());

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // 顯示書籍詳情
    showBookDetail(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return;

        const modalBody = document.getElementById('modalBody');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="book-detail">
                <div class="book-detail-cover">${book.cover || '📚'}</div>
                <div class="book-detail-info">
                    <h3>${this.escapeHtml(book.title)}</h3>
                    <p class="book-author">
                        <i class="fas fa-user"></i>
                        作者：${this.escapeHtml(book.author)}
                    </p>
                    <div class="book-detail-meta">
                        <div class="meta-item">
                            <span class="meta-label">分類</span>
                            <span class="meta-value">${this.escapeHtml(book.category || '未分類')}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">價格</span>
                            <span class="meta-value">NT$ ${book.price?.toLocaleString() || '0'}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">出版日期</span>
                            <span class="meta-value">${book.publishDate || '未知'}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">頁數</span>
                            <span class="meta-value">${book.pages || '未知'}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">ISBN</span>
                            <span class="meta-value">${book.isbn || '未知'}</span>
                        </div>
                    </div>
                    <div style="margin-top: 20px;">
                        <h4 style="margin-bottom: 10px; color: var(--text-primary);">書籍描述</h4>
                        <p style="line-height: 1.6; color: var(--text-secondary);">${this.escapeHtml(book.description)}</p>
                    </div>
                </div>
            </div>
        `;

        // 設置模態框按鈕事件
        const editBtn = document.getElementById('editBookBtn');
        const deleteBtn = document.getElementById('deleteBookBtn');
        
        if (editBtn) {
            editBtn.onclick = () => {
                this.closeModal();
                this.editBook(bookId);
            };
        }
        
        if (deleteBtn) {
            deleteBtn.onclick = () => {
                this.closeModal();
                this.confirmDeleteBook(bookId);
            };
        }

        this.showModal();
    }

    // 編輯書籍
    editBook(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return;

        this.editingBookId = bookId;
        
        // 切換到表單頁面
        this.showSection('add-book');
        
        // 更新表單標題
        document.getElementById('formTitle').innerHTML = `
            <i class="fas fa-edit"></i>
            編輯圖書
        `;
        document.getElementById('formSubtitle').textContent = '修改書籍資訊';
        
        // 填充表單資料
        document.getElementById('bookId').value = book.id;
        document.getElementById('bookTitle').value = book.title;
        document.getElementById('bookAuthor').value = book.author;
        document.getElementById('bookCategory').value = book.category || '';
        document.getElementById('bookPrice').value = book.price || '';
        document.getElementById('bookPublishDate').value = book.publishDate || '';
        document.getElementById('bookPages').value = book.pages || '';
        document.getElementById('bookISBN').value = book.isbn || '';
        document.getElementById('bookDescription').value = book.description || '';
        
        // 更新字數統計
        this.updateCharCount(book.description?.length || 0);
        
        // 更新提交按鈕文字
        document.getElementById('submitBtn').innerHTML = `
            <i class="fas fa-save"></i>
            <span>更新書籍</span>
        `;
    }

    // 確認刪除書籍
    confirmDeleteBook(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return;

        document.getElementById('deleteBookTitle').textContent = book.title;
        
        // 設置確認按鈕事件
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                this.deleteBook(bookId);
                this.closeDeleteModal();
            };
        }

        this.showDeleteModal();
    }

    // 刪除書籍
    deleteBook(bookId) {
        const bookIndex = this.books.findIndex(b => b.id === bookId);
        if (bookIndex === -1) return;

        const bookTitle = this.books[bookIndex].title;
        this.books.splice(bookIndex, 1);
        this.saveToLocalStorage();
        
        // 更新相關顯示
        this.updateStats();
        this.renderBooks();
        this.renderRecentBooks();
        this.populateCategoryFilter();
        
        this.showNotification(`成功刪除書籍「${bookTitle}」`, 'success');
    }

    // 處理表單提交
    handleFormSubmit() {
        const formData = this.getFormData();
        
        // 驗證表單
        if (!this.validateForm(formData)) {
            return;
        }

        if (this.editingBookId) {
            this.updateBook(formData);
        } else {
            this.addBook(formData);
        }
    }

    // 獲取表單資料
    getFormData() {
        return {
            id: document.getElementById('bookId').value || null,
            title: document.getElementById('bookTitle').value.trim(),
            author: document.getElementById('bookAuthor').value.trim(),
            category: document.getElementById('bookCategory').value,
            price: parseInt(document.getElementById('bookPrice').value) || 0,
            publishDate: document.getElementById('bookPublishDate').value,
            pages: parseInt(document.getElementById('bookPages').value) || 0,
            isbn: document.getElementById('bookISBN').value.trim(),
            description: document.getElementById('bookDescription').value.trim()
        };
    }

    // 驗證表單
    validateForm(formData) {
        let isValid = true;
        
        // 清除之前的錯誤
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });

        // 驗證書名
        if (!formData.title) {
            this.showFieldError('bookTitle', '請輸入書名');
            isValid = false;
        }

        // 驗證作者
        if (!formData.author) {
            this.showFieldError('bookAuthor', '請輸入作者姓名');
            isValid = false;
        }

        // 驗證描述長度
        if (formData.description.length > 500) {
            this.showFieldError('bookDescription', '描述不能超過 500 字');
            isValid = false;
        }

        return isValid;
    }

    // 顯示欄位錯誤
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        formGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // 新增書籍
    addBook(formData) {
        const newBook = {
            ...formData,
            id: this.generateId(),
            cover: this.getRandomCover(),
            addedDate: new Date()
        };

        this.books.push(newBook);
        this.saveToLocalStorage();
        
        this.updateStats();
        this.populateCategoryFilter();
        this.showNotification(`成功新增書籍「${newBook.title}」`, 'success');
        
        this.resetForm();
        setTimeout(() => {
            this.showSection('books');
        }, 1000);
    }

    // 更新書籍
    updateBook(formData) {
        const bookIndex = this.books.findIndex(b => b.id === this.editingBookId);
        if (bookIndex === -1) return;

        const updatedBook = {
            ...this.books[bookIndex],
            ...formData,
            id: this.editingBookId
        };

        this.books[bookIndex] = updatedBook;
        this.saveToLocalStorage();
        
        this.updateStats();
        this.renderBooks();
        this.renderRecentBooks();
        this.populateCategoryFilter();
        
        this.showNotification(`成功更新書籍「${updatedBook.title}」`, 'success');
        
        this.resetForm();
        setTimeout(() => {
            this.showSection('books');
        }, 1000);
    }

    // 重置表單
    resetForm() {
        const form = document.getElementById('bookForm');
        if (form) {
            form.reset();
        }
        
        this.editingBookId = null;
        
        // 重置表單標題
        document.getElementById('formTitle').innerHTML = `
            <i class="fas fa-plus-circle"></i>
            新增圖書
        `;
        document.getElementById('formSubtitle').textContent = '填寫詳細的書籍資訊';
        
        // 重置提交按鈕
        document.getElementById('submitBtn').innerHTML = `
            <i class="fas fa-save"></i>
            <span>儲存書籍</span>
        `;
        
        // 清除錯誤狀態
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        
        // 重置字數統計
        this.updateCharCount(0);
    }

    // 生成唯一ID
    generateId() {
        return Math.max(...this.books.map(b => b.id), 0) + 1;
    }

    // 獲取隨機封面圖示
    getRandomCover() {
        const covers = ['📚', '📖', '📝', '📄', '📋', '📰', '🗞️', '📑', '📜', '📒', '📓', '📔', '📕', '📗', '📘', '📙'];
        return covers[Math.floor(Math.random() * covers.length)];
    }

    // 更新字數統計
    updateCharCount(count) {
        const charCount = document.getElementById('charCount');
        if (charCount) {
            charCount.textContent = count;
            charCount.style.color = count > 500 ? 'var(--danger-color)' : 'var(--text-light)';
        }
    }

    // 顯示模態框
    showModal() {
        const modal = document.getElementById('bookModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    // 關閉模態框
    closeModal() {
        const modal = document.getElementById('bookModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    // 顯示刪除確認模態框
    showDeleteModal() {
        const modal = document.getElementById('deleteModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    // 關閉刪除確認模態框
    closeDeleteModal() {
        const modal = document.getElementById('deleteModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    // 顯示通知
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const messageElement = notification.querySelector('.notification-message');
        const iconElement = notification.querySelector('.notification-icon');
        
        if (!notification || !messageElement || !iconElement) return;

        // 設置圖示
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        iconElement.className = `notification-icon ${icons[type] || icons.info}`;
        messageElement.textContent = message;
        notification.className = `notification ${type}`;
        
        // 顯示通知
        notification.classList.add('show');
        
        // 自動隱藏
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    // 隱藏通知
    hideNotification() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.remove('show');
        }
    }

    // 顯示載入動畫
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('show');
        }
    }

    // 隱藏載入動畫
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('show');
        }
    }

    // 匯出資料
    exportData() {
        this.showLoading();
        
        setTimeout(() => {
            try {
                const dataStr = JSON.stringify(this.books, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                
                const link = document.createElement('a');
                link.href = url;
                link.download = `圖書資料_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                URL.revokeObjectURL(url);
                this.showNotification('資料匯出成功！', 'success');
            } catch (error) {
                this.showNotification('匯出失敗，請稍後再試', 'error');
            } finally {
                this.hideLoading();
            }
        }, 1000);
    }

    // 匯入資料
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            this.showLoading();
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedBooks = JSON.parse(e.target.result);
                    
                    if (!Array.isArray(importedBooks)) {
                        throw new Error('無效的資料格式');
                    }
                    
                    // 驗證資料結構
                    const validBooks = importedBooks.filter(book => 
                        book.title && book.author && typeof book.title === 'string' && typeof book.author === 'string'
                    ).map(book => ({
                        ...book,
                        id: this.generateId(),
                        addedDate: new Date(book.addedDate || Date.now()),
                        cover: book.cover || this.getRandomCover()
                    }));
                    
                    if (validBooks.length === 0) {
                        throw new Error('沒有找到有效的書籍資料');
                    }
                    
                    // 合併資料
                    this.books = [...this.books, ...validBooks];
                    this.saveToLocalStorage();
                    
                    this.updateStats();
                    this.renderBooks();
                    this.renderRecentBooks();
                    this.populateCategoryFilter();
                    
                    this.showNotification(`成功匯入 ${validBooks.length} 本書籍`, 'success');
                    
                } catch (error) {
                    this.showNotification(`匯入失敗：${error.message}`, 'error');
                } finally {
                    this.hideLoading();
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    // 更新元素內容
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    // HTML 轉義
    escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // 格式化日期
    formatDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString('zh-TW');
    }

    // 搜尋高亮
    highlightSearchTerm(text, searchTerm) {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // 去抖動函數
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

    // 響應式處理
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        const navMenu = document.getElementById('navMenu');
        
        if (navMenu) {
            if (!isMobile) {
                navMenu.classList.remove('show');
            }
        }
        
        // 調整每頁顯示數量
        this.booksPerPage = isMobile ? 6 : 12;
        this.renderBooks();
    }

    // 鍵盤快捷鍵
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K: 聚焦搜尋框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Ctrl/Cmd + N: 新增書籍
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.showSection('add-book');
        }
        
        // Ctrl/Cmd + H: 回到首頁
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            this.showSection('dashboard');
        }
    }
}

// 全域函數，供 HTML 中的 onclick 使用
let bookSystem;

// DOM 載入完成後初始化系統
document.addEventListener('DOMContentLoaded', () => {
    bookSystem = new BookManagementSystem();
    
    // 監聽視窗大小變化
    window.addEventListener('resize', bookSystem.debounce(() => {
        bookSystem.handleResize();
    }, 250));
    
    // 監聽鍵盤快捷鍵
    document.addEventListener('keydown', (e) => {
        bookSystem.handleKeyboardShortcuts(e);
    });
    
    // 初始響應式處理
    bookSystem.handleResize();
});

// 全域輔助函數
window.showSection = (section) => bookSystem.showSection(section);
window.resetForm = () => bookSystem.resetForm();
window.closeModal = () => bookSystem.closeModal();
window.closeDeleteModal = () => bookSystem.closeDeleteModal();
window.exportData = () => bookSystem.exportData();
window.importData = () => bookSystem.importData();

// 服務工作者註冊（如果需要離線支援）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// 頁面可見性變化處理
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && bookSystem) {
        // 頁面重新變為可見時，更新資料
        bookSystem.updateStats();
        bookSystem.renderRecentBooks();
    }
});

// 錯誤處理
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    if (bookSystem) {
        bookSystem.showNotification('系統發生錯誤，請重新整理頁面', 'error');
    }
});

// 未處理的 Promise 拒絕
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    if (bookSystem) {
        bookSystem.showNotification('操作失敗，請稍後再試', 'error');
    }
});

// 匯出類別供其他腳本使用
window.BookManagementSystem = BookManagementSystem;