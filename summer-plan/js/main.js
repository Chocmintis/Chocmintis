// JavaScript code for the Summer Plan website
        function openTab(evt, tabName) {
            var i, tabContent, tabBtns;
            
            // Hide all tab content
            tabContent = document.getElementsByClassName("tab-content");
            for (i = 0; i < tabContent.length; i++) {
                tabContent[i].style.display = "none";
            }
            
            // Remove "active" class from all tab buttons
            tabBtns = document.getElementsByClassName("tab-btn");
            for (i = 0; i < tabBtns.length; i++) {
                tabBtns[i].className = tabBtns[i].className.replace(" active", "");
            }
            
            // Show the current tab and add "active" class to the button
            document.getElementById(tabName).style.display = "block";
            evt.currentTarget.className += " active";
        }
        // กำหนดวันสิ้นสุดหลักสูตร
        const endDate = new Date('June 15, 2025 21:00:00').getTime();
        // กำหนดวันเริ่มต้นหลักสูตร
        const startDate = new Date('April 8, 2025 09:00:00').getTime();
        
        // อัพเดทตัวนับถอยหลังทุกวินาที
        const countdown = setInterval(function() {
            // เวลาปัจจุบัน
            const now = new Date().getTime();
            
            // คำนวณเวลาที่เหลือ
            const remaining = endDate - now;
            
            // คำนวณวัน ชั่วโมง นาที และวินาที
            const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            
            // คำนวณความคืบหน้าเป็นเปอร์เซ็นต์
            const totalDuration = endDate - startDate;
            const elapsed = now - startDate;
            const progress = Math.min(100, Math.max(0, Math.floor((elapsed / totalDuration) * 100)));
            
            // แสดงผลในหน้าเว็บ
            document.getElementById('days').innerHTML = days < 10 ? '0' + days : days;
            document.getElementById('hours').innerHTML = hours < 10 ? '0' + hours : hours;
            document.getElementById('minutes').innerHTML = minutes < 10 ? '0' + minutes : minutes;
            document.getElementById('seconds').innerHTML = seconds < 10 ? '0' + seconds : seconds;
            
            // อัพเดทความคืบหน้า
            document.getElementById('progress-fill').style.width = progress + '%';
            document.getElementById('progress-percent').innerHTML = progress + '%';
            
            // ถ้าการนับถอยหลังสิ้นสุด
            if (remaining < 0) {
                clearInterval(countdown);
                document.getElementById('days').innerHTML = '00';
                document.getElementById('hours').innerHTML = '00';
                document.getElementById('minutes').innerHTML = '00';
                document.getElementById('seconds').innerHTML = '00';
                document.getElementById('progress-fill').style.width = '100%';
                document.getElementById('progress-percent').innerHTML = '100%';
            }
        }, 1000);
        // ข้อมูลความคืบหน้า
    let progressData = {
        subjects: {
            calculus: { total: 30, completed: 0 },
            discrete: { total: 30, completed: 0 },
            datastructure: { total: 40, completed: 0 },
            python: { total: 30, completed: 0 },
            rust: { total: 30, completed: 0 },
            english: { total: 20, completed: 0 },
            game: { total: 50, completed: 0 },
            web: { total: 40, completed: 0 },
            linux: { total: 20, completed: 0 },
            typing: { total: 10, completed: 0 },
            problem: { total: 20, completed: 0 }
        },
        projects: {
            web: { milestones: [false, false, false, false, false] },
            game: { milestones: [false, false, false, false, false] },
            python: { milestones: [false, false, false, false, false] }
        }
    };
    
    // โหลดข้อมูลจาก localStorage ถ้ามี
    function loadProgress() {
        const savedProgress = localStorage.getItem('studyProgress');
        if (savedProgress) {
            progressData = JSON.parse(savedProgress);
            updateAllProgressDisplays();
        }
    }
    
    // บันทึกข้อมูลลง localStorage
    function saveProgress() {
        localStorage.setItem('studyProgress', JSON.stringify(progressData));
    }
    
    // อัพเดทการแสดงผลทั้งหมด
    function updateAllProgressDisplays() {
        // อัพเดทความคืบหน้ารายวิชา
        Object.keys(progressData.subjects).forEach(subject => {
            const data = progressData.subjects[subject];
            const percent = Math.round((data.completed / data.total) * 100);
            
            // อัพเดทแถบความคืบหน้า
            const subjectCards = document.querySelectorAll(`.subject-card[class*="${subject}"]`);
            if (subjectCards.length > 0) {
                const card = subjectCards[0];
                const progressFill = card.querySelector('.subject-progress-fill');
                const hoursDisplay = card.querySelector('.subject-hours');
                
                if (progressFill) progressFill.style.width = `${percent}%`;
                if (hoursDisplay) hoursDisplay.textContent = `${data.completed}/${data.total} ชม.`;
            }
        });
        
        // อัพเดทความคืบหน้าโปรเจค
        Object.keys(progressData.projects).forEach(project => {
            const milestones = progressData.projects[project].milestones;
            const completedMilestones = milestones.filter(m => m).length;
            const totalMilestones = milestones.length;
            const percent = Math.round((completedMilestones / totalMilestones) * 100);
            
            // อัพเดทเช็คบ็อกซ์
            milestones.forEach((isCompleted, index) => {
                const checkbox = document.querySelector(`#${project}-milestone-${index + 1}`);
                if (checkbox) checkbox.checked = isCompleted;
            });
            
            // อัพเดทแถบความคืบหน้าและเปอร์เซ็นต์
            const projectCard = document.querySelector(`.project-card:has(h4:contains("${project}"))`);
            if (projectCard) {
                const progressFill = projectCard.querySelector('.project-progress-fill');
                const percentDisplay = projectCard.querySelector('.project-percent');
                
                if (progressFill) progressFill.style.width = `${percent}%`;
                if (percentDisplay) percentDisplay.textContent = `${percent}%`;
            }
        });
        
        // คำนวณและอัพเดทความคืบหน้ารวม
        updateOverallProgress();
    }
    
    // คำนวณความคืบหน้ารวม
    function updateOverallProgress() {
        // คำนวณความคืบหน้ารายวิชา
        let totalHours = 0;
        let completedHours = 0;
        let completedSubjects = 0;
        
        Object.values(progressData.subjects).forEach(subject => {
            totalHours += subject.total;
            completedHours += subject.completed;
            if (subject.completed >= subject.total) completedSubjects++;
        });
        
        // คำนวณความคืบหน้าโปรเจค
        let totalMilestones = 0;
        let completedMilestones = 0;
        
        Object.values(progressData.projects).forEach(project => {
            totalMilestones += project.milestones.length;
            completedMilestones += project.milestones.filter(m => m).length;
        });
        
        const subjectsPercent = (completedHours / totalHours) * 100;
        const projectsPercent = (completedMilestones / totalMilestones) * 100;
        
        // คำนวณความคืบหน้ารวม (70% จากวิชา, 30% จากโปรเจค)
        const overallPercent = Math.round((subjectsPercent * 0.7) + (projectsPercent * 0.3));
        
        // อัพเดท UI
        const overallProgressCircle = document.getElementById('overall-progress-circle');
        const overallProgressPercent = document.getElementById('overall-progress-percent');
        const completedSubjectsEl = document.getElementById('completed-subjects');
        const completedHoursEl = document.getElementById('completed-hours');
        const projectProgressEl = document.getElementById('project-progress');
        
        if (overallProgressCircle) {
            const circumference = 2 * Math.PI * 54;
            const offset = circumference - (overallPercent / 100 * circumference);
            overallProgressCircle.style.strokeDashoffset = offset;
        }
        
        if (overallProgressPercent) overallProgressPercent.textContent = `${overallPercent}%`;
        if (completedSubjectsEl) completedSubjectsEl.textContent = `${completedSubjects}/11`;
        if (completedHoursEl) completedHoursEl.textContent = `${completedHours}/${totalHours}`;
        if (projectProgressEl) projectProgressEl.textContent = `${Math.round(projectsPercent)}%`;
    }
    
    // เพิ่ม Event Listeners
    document.addEventListener('DOMContentLoaded', function() {
        // โหลดข้อมูลเมื่อโหลดหน้าเว็บ
        loadProgress();
        
        // Event listener สำหรับปุ่มอัพเดทวิชา
        document.querySelectorAll('.subject-update-btn').forEach(button => {
            button.addEventListener('click', function() {
                const subject = this.dataset.subject;
                const total = parseInt(this.dataset.total);
                
                // แสดง Dialog ให้ป้อนจำนวนชั่วโมงที่เรียนแล้ว
                const hours = prompt(`ป้อนจำนวนชั่วโมงที่เรียนวิชา ${subject} แล้ว (0-${total}):`, progressData.subjects[subject].completed);
                
                if (hours !== null) {
                    const completedHours = Math.min(total, Math.max(0, parseInt(hours) || 0));
                    progressData.subjects[subject].completed = completedHours;
                    saveProgress();
                    updateAllProgressDisplays();
                }
            });
        });
        
        // Event listener สำหรับ milestone checkboxes
        document.querySelectorAll('.milestone-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const project = this.dataset.project;
                const milestone = parseInt(this.dataset.milestone) - 1;
                
                progressData.projects[project].milestones[milestone] = this.checked;
                saveProgress();
                updateAllProgressDisplays();
            });
        });
        
        // ตั้งค่า progress circle
        const overallProgressCircle = document.getElementById('overall-progress-circle');
        if (overallProgressCircle) {
            const circumference = 2 * Math.PI * 54;
            overallProgressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        }
    });
    
    // เพิ่มเมธอดเพื่อค้นหา element ที่มีข้อความเฉพาะภายใน (สำหรับการอัพเดท UI)
    if (!HTMLElement.prototype.hasOwnProperty('contains')) {
        HTMLElement.prototype.contains = function(selector) {
            return this.textContent.includes(selector);
        };
    }