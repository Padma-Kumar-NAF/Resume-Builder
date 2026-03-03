var resumeData = {
      fullName:  "",
      role:      "",
      phone:     "",
      email:     "",
      location:  "",
      linkedin:  "",
      github:    "",
      summary:   "",
      skills:        [], 
      experience:    [], 
      education:     [], 
      projects:      [],
      certifications:[], 
      languages:     [], 
      hobbies:       []  
    };


    document.getElementById("summary").addEventListener("input", function () {
      var currentLength = this.value.length;
      document.getElementById("summaryCount").textContent =
        "(" + currentLength + " / 500)";
    });

    document.getElementById("resumeForm").addEventListener("submit", function (e) {
      e.preventDefault();

      var isValid = validateForm();
      if (!isValid) return;

      collectFormData();

      renderPreview();

      document.getElementById("preview").scrollIntoView({ behavior: "smooth" });
    });


    function validateForm() {
      var allGood = true;

      function checkField(fieldId, testFunction, errorId) {
        var field = document.getElementById(fieldId);
        var value = field.value.trim();
        var errorEl = document.getElementById(errorId);

        if (testFunction(value)) {
          field.style.borderColor = "#198754"; 
          errorEl.style.display = "none";
        } else {
          field.style.borderColor = "#dc3545";
          errorEl.style.display = "block";
          allGood = false;
        }
      }

      checkField("fullName", function (val) {
        return val.length > 0;
      }, "err-fullName");

      checkField("role", function (val) {
        return val.length > 0;
      }, "err-role");
x
      checkField("phone", function (val) {
        var digits = val.replace(/\D/g, "");
        return digits.length >= 10;
      }, "err-phone");

      checkField("email", function (val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }, "err-email");

      checkField("summary", function (val) {
        return val.length > 0;
      }, "err-summary");

      return allGood;
    }

    function collectFormData() {
      resumeData.fullName = document.getElementById("fullName").value.trim();
      resumeData.role     = document.getElementById("role").value.trim();
      resumeData.phone    = document.getElementById("phone").value.trim();
      resumeData.email    = document.getElementById("email").value.trim();
      resumeData.location = document.getElementById("location").value.trim();
      resumeData.linkedin = document.getElementById("linkedin").value.trim();
      resumeData.github   = document.getElementById("github").value.trim();
      resumeData.summary  = document.getElementById("summary").value.trim();

      var hobbiesValue = document.getElementById("hobbies").value.trim();
      if (hobbiesValue) {
        resumeData.hobbies = hobbiesValue.split(",").map(function (h) {
          return h.trim();
        });
      } else {
        resumeData.hobbies = [];
      }
    }

    function addSkill() {
      var input = document.getElementById("skillInput");
      var skill = input.value.trim();

      if (!skill) return;
      if (resumeData.skills.includes(skill)) {
        alert("This skill is already added.");
        return;
      }

      resumeData.skills.push(skill);
      input.value = "";
      renderSkills();
    }

    function removeSkill(index) {
      resumeData.skills.splice(index, 1);
      renderSkills();
    }

    function renderSkills() {
      var container = document.getElementById("skillsContainer");
      container.innerHTML = ""; 

      resumeData.skills.forEach(function (skill, index) {
        var chip = document.createElement("span");
        chip.className = "badge-chip bg-primary text-white";
        chip.innerHTML =
          skill +
          ' <button onclick="removeSkill(' + index + ')" title="Remove">✕</button>';
        container.appendChild(chip);
      });
    }

    function addExperience() {
      var newEntry = {
        id:               Date.now(),
        company:          "",
        title:            "",
        startDate:        "",
        endDate:          "",
        currentlyWorking: false,
        responsibilities: ""
      };

      resumeData.experience.push(newEntry);
      renderExperience();
    }

    function removeExperience(id) {
      resumeData.experience = resumeData.experience.filter(function (exp) {
        return exp.id !== id;
      });
      renderExperience();
    }

    function updateExperience(id, field, value) {
      var entry = resumeData.experience.find(function (exp) {
        return exp.id === id;
      });
      if (entry) {
        entry[field] = value;
      }
    }

    function toggleCurrentlyWorking(id) {
      var entry = resumeData.experience.find(function (exp) {
        return exp.id === id;
      });
      if (entry) {
        entry.currentlyWorking = !entry.currentlyWorking;
        renderExperience();
      }
    }

    function renderExperience() {
      var container = document.getElementById("expContainer");
      container.innerHTML = "";

      resumeData.experience.forEach(function (exp, index) {
        var box = document.createElement("div");
        box.className = "entry-box";

        box.innerHTML =
          '<div class="d-flex justify-content-between align-items-center mb-2">' +
            '<strong>Experience #' + (index + 1) + '</strong>' +
            '<button type="button" class="btn btn-sm btn-outline-danger" onclick="removeExperience(' + exp.id + ')">✕ Remove</button>' +
          '</div>' +

          '<div class="row g-2 mb-2">' +
            '<div class="col-md-6">' +
              '<label class="form-label">Company Name</label>' +
              '<input type="text" class="form-control" value="' + escapeHTML(exp.company) + '" placeholder="e.g. Google" onchange="updateExperience(' + exp.id + ', \'company\', this.value)" />' +
            '</div>' +
            '<div class="col-md-6">' +
              '<label class="form-label">Job Title</label>' +
              '<input type="text" class="form-control" value="' + escapeHTML(exp.title) + '" placeholder="e.g. Software Engineer" onchange="updateExperience(' + exp.id + ', \'title\', this.value)" />' +
            '</div>' +
          '</div>' +

          '<div class="row g-2 mb-2">' +
            '<div class="col-md-4">' +
              '<label class="form-label">Start Date</label>' +
              '<input type="date" class="form-control" value="' + exp.startDate + '" onchange="updateExperience(' + exp.id + ', \'startDate\', this.value)" />' +
            '</div>' +
            '<div class="col-md-4">' +
              '<label class="form-label">End Date</label>' +
              '<input type="date" class="form-control" value="' + exp.endDate + '" ' + (exp.currentlyWorking ? 'disabled' : '') + ' onchange="updateExperience(' + exp.id + ', \'endDate\', this.value)" />' +
            '</div>' +
            '<div class="col-md-4 d-flex align-items-end">' +
              '<div class="form-check mb-1">' +
                '<input type="checkbox" class="form-check-input" id="current_' + exp.id + '" ' + (exp.currentlyWorking ? 'checked' : '') + ' onchange="toggleCurrentlyWorking(' + exp.id + ')" />' +
                '<label class="form-check-label" for="current_' + exp.id + '">Currently Working</label>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div class="mb-1">' +
            '<label class="form-label">Responsibilities</label>' +
            '<textarea class="form-control" rows="3" placeholder="Describe what you did in this role..." onchange="updateExperience(' + exp.id + ', \'responsibilities\', this.value)">' + escapeHTML(exp.responsibilities) + '</textarea>' +
          '</div>';

        container.appendChild(box);
      });
    }

    function addEducation() {
      var newEntry = {
        id:          Date.now(),
        institution: "",
        degree:      "",
        startYear:   "",
        endYear:     "",
        score:       ""
      };
      resumeData.education.push(newEntry);
      renderEducation();
    }

    function removeEducation(id) {
      resumeData.education = resumeData.education.filter(function (edu) {
        return edu.id !== id;
      });
      renderEducation();
    }

    function updateEducation(id, field, value) {
      var entry = resumeData.education.find(function (edu) {
        return edu.id === id;
      });
      if (entry) entry[field] = value;
    }

    function renderEducation() {
      var container = document.getElementById("eduContainer");
      container.innerHTML = "";

      resumeData.education.forEach(function (edu, index) {
        var box = document.createElement("div");
        box.className = "entry-box";

        box.innerHTML =
          '<div class="d-flex justify-content-between align-items-center mb-2">' +
            '<strong>Education #' + (index + 1) + '</strong>' +
            '<button type="button" class="btn btn-sm btn-outline-danger" onclick="removeEducation(' + edu.id + ')">✕ Remove</button>' +
          '</div>' +

          '<div class="row g-2 mb-2">' +
            '<div class="col-md-6">' +
              '<label class="form-label">Institution / School</label>' +
              '<input type="text" class="form-control" value="' + escapeHTML(edu.institution) + '" placeholder="e.g. IIT Bombay" onchange="updateEducation(' + edu.id + ', \'institution\', this.value)" />' +
            '</div>' +
            '<div class="col-md-6">' +
              '<label class="form-label">Degree</label>' +
              '<input type="text" class="form-control" value="' + escapeHTML(edu.degree) + '" placeholder="e.g. B.Tech Computer Science" onchange="updateEducation(' + edu.id + ', \'degree\', this.value)" />' +
            '</div>' +
          '</div>' +

          '<div class="row g-2">' +
            '<div class="col-md-4">' +
              '<label class="form-label">Start Year</label>' +
              '<input type="number" class="form-control" value="' + edu.startYear + '" placeholder="2020" onchange="updateEducation(' + edu.id + ', \'startYear\', this.value)" />' +
            '</div>' +
            '<div class="col-md-4">' +
              '<label class="form-label">End Year</label>' +
              '<input type="number" class="form-control" value="' + edu.endYear + '" placeholder="2024" onchange="updateEducation(' + edu.id + ', \'endYear\', this.value)" />' +
            '</div>' +
            '<div class="col-md-4">' +
              '<label class="form-label">Score / CGPA</label>' +
              '<input type="text" class="form-control" value="' + escapeHTML(edu.score) + '" placeholder="e.g. 8.5" onchange="updateEducation(' + edu.id + ', \'score\', this.value)" />' +
            '</div>' +
          '</div>';

        container.appendChild(box);
      });
    }

    function addProject() {
      var newEntry = {
        id:          Date.now(),
        title:       "",
        techStack:   "",
        description: "",
        link:        ""
      };
      resumeData.projects.push(newEntry);
      renderProjects();
    }

    function removeProject(id) {
      resumeData.projects = resumeData.projects.filter(function (proj) {
        return proj.id !== id;
      });
      renderProjects();
    }

    function updateProject(id, field, value) {
      var entry = resumeData.projects.find(function (proj) {
        return proj.id === id;
      });
      if (entry) entry[field] = value;
    }

    function renderProjects() {
      var container = document.getElementById("projContainer");
      container.innerHTML = "";

      resumeData.projects.forEach(function (proj, index) {
        var box = document.createElement("div");
        box.className = "entry-box";

        box.innerHTML =
          '<div class="d-flex justify-content-between align-items-center mb-2">' +
            '<strong>Project #' + (index + 1) + '</strong>' +
            '<button type="button" class="btn btn-sm btn-outline-danger" onclick="removeProject(' + proj.id + ')">✕ Remove</button>' +
          '</div>' +

          '<div class="row g-2 mb-2">' +
            '<div class="col-md-6">' +
              '<label class="form-label">Project Title</label>' +
              '<input type="text" class="form-control" value="' + escapeHTML(proj.title) + '" placeholder="e.g. Portfolio Website" onchange="updateProject(' + proj.id + ', \'title\', this.value)" />' +
            '</div>' +
            '<div class="col-md-6">' +
              '<label class="form-label">Tech Stack</label>' +
              '<input type="text" class="form-control" value="' + escapeHTML(proj.techStack) + '" placeholder="e.g. React, Node.js" onchange="updateProject(' + proj.id + ', \'techStack\', this.value)" />' +
            '</div>' +
          '</div>' +

          '<div class="mb-2">' +
            '<label class="form-label">Description</label>' +
            '<textarea class="form-control" rows="2" placeholder="What does this project do?" onchange="updateProject(' + proj.id + ', \'description\', this.value)">' + escapeHTML(proj.description) + '</textarea>' +
          '</div>' +

          '<div>' +
            '<label class="form-label">Live / GitHub Link</label>' +
            '<input type="text" class="form-control" value="' + escapeHTML(proj.link) + '" placeholder="https://github.com/you/project" onchange="updateProject(' + proj.id + ', \'link\', this.value)" />' +
          '</div>';

        container.appendChild(box);
      });
    }
    function addCertification() {
      var input = document.getElementById("certInput");
      var value = input.value.trim();
      if (!value) return;

      resumeData.certifications.push(value);
      input.value = "";
      renderCertifications();
    }

    function removeCertification(index) {
      resumeData.certifications.splice(index, 1);
      renderCertifications();
    }

    function renderCertifications() {
      var container = document.getElementById("certContainer");
      container.innerHTML = "";

      resumeData.certifications.forEach(function (cert, index) {
        var chip = document.createElement("span");
        chip.className = "badge-chip bg-success text-white";
        chip.innerHTML =
          cert +
          ' <button onclick="removeCertification(' + index + ')" title="Remove">✕</button>';
        container.appendChild(chip);
      });
    }

    function addLanguage() {
      var input = document.getElementById("langInput");
      var value = input.value.trim();
      if (!value) return;

      resumeData.languages.push(value);
      input.value = "";
      renderLanguages();
    }

    function removeLanguage(index) {
      resumeData.languages.splice(index, 1);
      renderLanguages();
    }

    function renderLanguages() {
      var container = document.getElementById("langContainer");
      container.innerHTML = "";

      resumeData.languages.forEach(function (lang, index) {
        var chip = document.createElement("span");
        chip.className = "badge-chip bg-secondary text-white";
        chip.innerHTML =
          lang +
          ' <button onclick="removeLanguage(' + index + ')" title="Remove">✕</button>';
        container.appendChild(chip);
      });
    }

    function renderPreview() {
      var d = resumeData;
      var html = "";

      html += '<div class="resume-box">';

      html += '<div class="resume-name">' + escapeHTML(d.fullName) + '</div>';
      if (d.role) {
        html += '<div class="resume-role">' + escapeHTML(d.role) + '</div>';
      }

      html += '<div class="resume-contact">';
      if (d.phone)    html += '<span>📞 ' + escapeHTML(d.phone) + '</span>';
      if (d.email)    html += '<span>✉️ <a href="mailto:' + escapeHTML(d.email) + '">' + escapeHTML(d.email) + '</a></span>';
      if (d.location) html += '<span>📍 ' + escapeHTML(d.location) + '</span>';
      if (d.linkedin) html += '<span>🔗 <a href="' + escapeHTML(d.linkedin) + '" target="_blank">LinkedIn</a></span>';
      if (d.github)   html += '<span>💻 <a href="' + escapeHTML(d.github) + '" target="_blank">GitHub</a></span>';
      html += '</div>';

      if (d.summary) {
        html += '<div class="resume-section-title">Profile Summary</div>';
        html += '<p style="font-size:0.87rem; color:#333;">' + escapeHTML(d.summary) + '</p>';
      }

      if (d.skills.length > 0) {
        html += '<div class="resume-section-title">Skills</div>';
        html += '<div>';
        d.skills.forEach(function (skill) {
          html += '<span class="resume-skill-badge">' + escapeHTML(skill) + '</span>';
        });
        html += '</div>';
      }

      if (d.experience.length > 0) {
        html += '<div class="resume-section-title">Experience</div>';

        d.experience.forEach(function (exp) {
          html += '<div class="resume-entry">';

          html += '<div class="d-flex justify-content-between">';
          html += '<span class="resume-entry-title">' + escapeHTML(exp.title) + '</span>';

          var dateText = "";
          if (exp.startDate) dateText += formatDate(exp.startDate);
          if (exp.startDate && (exp.endDate || exp.currentlyWorking)) dateText += " – ";
          if (exp.currentlyWorking) {
            dateText += "Present";
          } else if (exp.endDate) {
            dateText += formatDate(exp.endDate);
          }
          if (dateText) html += '<span class="resume-entry-date">' + dateText + '</span>';
          html += '</div>';

          if (exp.company) {
            html += '<div class="resume-entry-subtitle">' + escapeHTML(exp.company) + '</div>';
          }
          if (exp.responsibilities) {
            html += '<div class="resume-entry-body">' + escapeHTML(exp.responsibilities) + '</div>';
          }

          html += '</div>';
        });
      }

      if (d.education.length > 0) {
        html += '<div class="resume-section-title">Education</div>';

        d.education.forEach(function (edu) {
          html += '<div class="resume-entry">';
          html += '<div class="d-flex justify-content-between">';
          html += '<span class="resume-entry-title">' + escapeHTML(edu.degree) + '</span>';

          var yearText = "";
          if (edu.startYear) yearText += edu.startYear;
          if (edu.startYear && edu.endYear) yearText += " – ";
          if (edu.endYear) yearText += edu.endYear;
          if (yearText) html += '<span class="resume-entry-date">' + yearText + '</span>';

          html += '</div>';
          if (edu.institution) {
            html += '<div class="resume-entry-subtitle">' + escapeHTML(edu.institution) + '</div>';
          }
          if (edu.score) {
            html += '<div class="resume-entry-body">Score: ' + escapeHTML(edu.score) + '</div>';
          }
          html += '</div>';
        });
      }

      if (d.projects.length > 0) {
        html += '<div class="resume-section-title">Projects</div>';

        d.projects.forEach(function (proj) {
          html += '<div class="resume-entry">';
          html += '<div class="d-flex justify-content-between">';
          html += '<span class="resume-entry-title">' + escapeHTML(proj.title) + '</span>';
          if (proj.techStack) {
            html += '<span class="resume-entry-date">' + escapeHTML(proj.techStack) + '</span>';
          }
          html += '</div>';
          if (proj.description) {
            html += '<div class="resume-entry-body">' + escapeHTML(proj.description) + '</div>';
          }
          if (proj.link) {
            html += '<div style="font-size:0.8rem; margin-top:3px;"><a href="' + escapeHTML(proj.link) + '" target="_blank">' + escapeHTML(proj.link) + '</a></div>';
          }
          html += '</div>';
        });
      }

      if (d.certifications.length > 0) {
        html += '<div class="resume-section-title">Certifications</div>';
        html += '<ul style="font-size:0.85rem; padding-left:18px; margin-bottom:4px;">';
        d.certifications.forEach(function (cert) {
          html += '<li>' + escapeHTML(cert) + '</li>';
        });
        html += '</ul>';
      }
      if (d.languages.length > 0) {
        html += '<div class="resume-section-title">Languages</div>';
        html += '<div>';
        d.languages.forEach(function (lang) {
          html += '<span class="resume-skill-badge">' + escapeHTML(lang) + '</span>';
        });
        html += '</div>';
      }

      if (d.hobbies.length > 0) {
        html += '<div class="resume-section-title">Hobbies</div>';
        html += '<p style="font-size:0.85rem; color:#333;">' + d.hobbies.map(escapeHTML).join(' · ') + '</p>';
      }

      html += '</div>';

      document.getElementById("preview").innerHTML = html;
    }

    function downloadPDF() {
      var element = document.querySelector(".resume-box");

      if (!element) {
        alert("Please generate your resume first, then download.");
        return;
      }

      var options = {
        margin:      0.5,
        filename:    (resumeData.fullName || "Resume") + ".pdf",
        image:       { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF:       { unit: "in", format: "a4", orientation: "portrait" }
      };

      html2pdf().set(options).from(element).save();
    }

    function saveToLocalStorage() {
      collectFormData();

      localStorage.setItem("savedResume", JSON.stringify(resumeData));

      showToast("✅ Saved successfully!");
    }

    function loadFromLocalStorage() {
      var saved = localStorage.getItem("savedResume");

      if (!saved) {
        showToast("⚠️ No saved data found.");
        return;
      }

      resumeData = JSON.parse(saved);

      fillFormFromData();
      renderSkills();
      renderExperience();
      renderEducation();
      renderProjects();
      renderCertifications();
      renderLanguages();

      if (resumeData.fullName) renderPreview();

      showToast("✅ Data loaded!");
    }

    function fillFormFromData() {
      document.getElementById("fullName").value = resumeData.fullName || "";
      document.getElementById("role").value     = resumeData.role     || "";
      document.getElementById("phone").value    = resumeData.phone    || "";
      document.getElementById("email").value    = resumeData.email    || "";
      document.getElementById("location").value = resumeData.location || "";
      document.getElementById("linkedin").value = resumeData.linkedin || "";
      document.getElementById("github").value   = resumeData.github   || "";
      document.getElementById("summary").value  = resumeData.summary  || "";
      document.getElementById("hobbies").value  = (resumeData.hobbies || []).join(", ");

      var summaryLength = (resumeData.summary || "").length;
      document.getElementById("summaryCount").textContent =
        "(" + summaryLength + " / 500)";
    }


    function resetForm() {
      var confirmed = confirm("Are you sure you want to reset everything?");
      if (!confirmed) return;

      resumeData = {
        fullName: "", role: "", phone: "", email: "",
        location: "", linkedin: "", github: "", summary: "",
        skills: [], experience: [], education: [],
        projects: [], certifications: [], languages: [], hobbies: []
      };

      document.getElementById("resumeForm").reset();

      document.getElementById("skillsContainer").innerHTML = "";
      document.getElementById("expContainer").innerHTML    = "";
      document.getElementById("eduContainer").innerHTML    = "";
      document.getElementById("projContainer").innerHTML   = "";
      document.getElementById("certContainer").innerHTML   = "";
      document.getElementById("langContainer").innerHTML   = "";

      document.getElementById("summaryCount").textContent = "(0 / 500)";
      var inputs = document.querySelectorAll(".form-control");
      inputs.forEach(function (input) {
        input.style.borderColor = "";
      });

      document.getElementById("preview").innerHTML =
        '<div class="text-center py-5 text-muted border rounded">' +
          '<div style="font-size: 3rem;">📋</div>' +
          '<p class="mt-3">Your resume preview will appear here.<br />' +
          'Fill the form and click <strong>Generate Resume</strong>.</p>' +
        '</div>';
    }


    function formatDate(dateString) {
      if (!dateString) return "";
      var date = new Date(dateString);
      if (isNaN(date)) return dateString;
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    }

    function escapeHTML(str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g,  "&amp;")
        .replace(/</g,  "&lt;")
        .replace(/>/g,  "&gt;")
        .replace(/"/g,  "&quot;")
        .replace(/'/g,  "&#39;");
    }

    function showToast(message) {
      var toast = document.createElement("div");
      toast.className = "toast-msg";
      toast.textContent = message;
      document.body.appendChild(toast);

      setTimeout(function () {
        toast.remove();
      }, 2500);
    }



    (function autoLoadOnStart() {
      var saved = localStorage.getItem("savedResume");
      if (saved) {
        try {
          resumeData = JSON.parse(saved);
          fillFormFromData();
          renderSkills();
          renderExperience();
          renderEducation();
          renderProjects();
          renderCertifications();
          renderLanguages();
          if (resumeData.fullName) renderPreview();
        } catch (e) {
          console.log("Could not load saved data.");
        }
      }
    })();