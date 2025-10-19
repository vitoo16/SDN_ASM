// ============================================
// ADMIN DASHBOARD JAVASCRIPT
// ============================================

// Tab Switching
function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

  // Update tab panels
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.remove("active");
  });
  document.getElementById(`${tabName}-panel`).classList.add("active");
}

// Refresh Metrics
async function refreshMetrics() {
  const refreshBtn = document.getElementById("refreshBtn");
  if (refreshBtn) {
    refreshBtn.classList.add("refreshing");
    refreshBtn.disabled = true;
  }

  try {
    // Refresh the page to get updated metrics
    window.location.reload();
  } catch (error) {
    console.error("Error refreshing metrics:", error);
    if (refreshBtn) {
      refreshBtn.classList.remove("refreshing");
      refreshBtn.disabled = false;
    }
  }
}

// Show Success Message
function showSuccess(message) {
  const existing = document.querySelector(".success-message");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.className = "success-message";
  div.innerHTML = `
        <span class="material-icons" style="color: #34d399;">check_circle</span>
        <span>${message}</span>
    `;
  document.body.appendChild(div);

  setTimeout(() => {
    div.style.opacity = "0";
    setTimeout(() => div.remove(), 300);
  }, 4000);
}

// ============================================
// PERFUMES MANAGEMENT
// ============================================

function refreshPerfumes() {
  window.location.href = "/admin/dashboard?tab=perfumes";
}

function filterPerfumes() {
  const search = document.getElementById("perfumeSearch").value.toLowerCase();
  const brandFilter = document.getElementById("perfumeBrandFilter").value;
  const targetFilter = document.getElementById("perfumeTargetFilter").value;
  const concentrationFilter = document.getElementById(
    "perfumeConcentrationFilter"
  ).value;

  const rows = document.querySelectorAll("#perfumesTableBody tr");
  rows.forEach((row) => {
    const name = row.dataset.perfumeName.toLowerCase();
    const brand = row.dataset.perfumeBrand;
    const target = row.dataset.perfumeTarget;
    const concentration = row.dataset.perfumeConcentration;

    const matchesSearch = name.includes(search);
    const matchesBrand = !brandFilter || brand === brandFilter;
    const matchesTarget = !targetFilter || target === targetFilter;
    const matchesConcentration =
      !concentrationFilter || concentration === concentrationFilter;

    if (
      matchesSearch &&
      matchesBrand &&
      matchesTarget &&
      matchesConcentration
    ) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function clearPerfumeFilters() {
  document.getElementById("perfumeSearch").value = "";
  document.getElementById("perfumeBrandFilter").value = "";
  document.getElementById("perfumeTargetFilter").value = "";
  document.getElementById("perfumeConcentrationFilter").value = "";
  filterPerfumes();
}

// ============================================
// PERFUME MODAL FUNCTIONS
// ============================================

function openPerfumeDialog(perfumeId) {
  const modal = document.getElementById("perfumeModal");
  const title = document.getElementById("perfumeModalTitle");
  const submitBtn = document.getElementById("perfumeSubmitBtn");
  const form = document.getElementById("perfumeForm");
  const errorDiv = document.getElementById("perfumeModalError");

  // Reset form and error
  form.reset();
  errorDiv.style.display = "none";

  // Populate brands dropdown
  const brandSelect = document.getElementById("perfumeBrand");
  brandSelect.innerHTML = '<option value="">Select a brand</option>';
  if (window.brandsData) {
    window.brandsData.forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand._id;
      option.textContent = brand.brandName;
      brandSelect.appendChild(option);
    });
  }

  if (perfumeId) {
    // Edit mode
    title.textContent = "Edit Perfume";
    submitBtn.querySelector(".btn-text").textContent = "Update";

    // Find perfume data
    const perfume = window.perfumesData.find((p) => p._id === perfumeId);
    if (perfume) {
      document.getElementById("perfumeId").value = perfume._id;
      document.getElementById("perfumeName").value = perfume.perfumeName;
      document.getElementById("perfumeUri").value = perfume.uri;
      document.getElementById("perfumePrice").value = perfume.price;
      document.getElementById("perfumeVolume").value = perfume.volume;
      document.getElementById("perfumeConcentration").value =
        perfume.concentration;
      document.getElementById("perfumeTargetAudience").value =
        perfume.targetAudience;
      document.getElementById("perfumeBrand").value = perfume.brand._id;
      document.getElementById("perfumeDescription").value = perfume.description;
      document.getElementById("perfumeIngredients").value = perfume.ingredients;
    }
  } else {
    // Create mode
    title.textContent = "Add New Perfume";
    submitBtn.querySelector(".btn-text").textContent = "Create";
    document.getElementById("perfumeId").value = "";
  }

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closePerfumeModal() {
  const modal = document.getElementById("perfumeModal");
  modal.style.display = "none";
  document.body.style.overflow = "";
}

async function submitPerfumeForm(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = document.getElementById("perfumeSubmitBtn");
  const errorDiv = document.getElementById("perfumeModalError");
  const perfumeId = document.getElementById("perfumeId").value;

  // Show loading
  submitBtn.disabled = true;
  submitBtn.querySelector(".btn-text").style.display = "none";
  submitBtn.querySelector(".btn-spinner").style.display = "inline-block";
  errorDiv.style.display = "none";

  try {
    const formData = {
      perfumeName: document.getElementById("perfumeName").value,
      uri: document.getElementById("perfumeUri").value,
      price: parseFloat(document.getElementById("perfumePrice").value),
      volume: parseInt(document.getElementById("perfumeVolume").value),
      concentration: document.getElementById("perfumeConcentration").value,
      targetAudience: document.getElementById("perfumeTargetAudience").value,
      brand: document.getElementById("perfumeBrand").value,
      description: document.getElementById("perfumeDescription").value,
      ingredients: document.getElementById("perfumeIngredients").value,
    };

    const token = getAuthToken();
    if (!token) {
      errorDiv.textContent =
        "Authentication required. Please refresh the page and login again.";
      errorDiv.style.display = "block";
      return;
    }

    const url = perfumeId ? `/api/perfumes/${perfumeId}` : "/api/perfumes";
    const method = perfumeId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      closePerfumeModal();
      showSuccess(
        perfumeId
          ? `Perfume "${formData.perfumeName}" updated successfully`
          : `Perfume "${formData.perfumeName}" created successfully`
      );
      setTimeout(() => window.location.reload(), 1000);
    } else {
      // Try to parse as JSON, if it fails, show the response type
      let errorMessage = "Failed to save perfume";
      try {
        const data = await response.json();
        errorMessage =
          data.message ||
          `Server error: ${response.status} ${response.statusText}`;
      } catch (e) {
        // Response is not JSON (probably HTML)
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        errorMessage = `Server returned ${response.status}. Check console for details.`;
      }
      errorDiv.textContent = errorMessage;
      errorDiv.style.display = "block";
    }
  } catch (error) {
    console.error("Error saving perfume:", error);
    errorDiv.textContent = "Failed to save perfume";
    errorDiv.style.display = "block";
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector(".btn-text").style.display = "inline";
    submitBtn.querySelector(".btn-spinner").style.display = "none";
  }
}

function viewPerfume(id) {
  window.location.href = `/perfumes/${id}`;
}

function editPerfume(id) {
  openPerfumeDialog(id);
}

async function deletePerfume(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) {
    return;
  }

  try {
    const token = getAuthToken();
    if (!token) {
      alert(
        "Authentication required. Please refresh the page and login again."
      );
      return;
    }

    const response = await fetch(`/api/perfumes/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      showSuccess(`Perfume "${name}" deleted successfully`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      const data = await response.json();
      alert(data.message || "Failed to delete perfume");
    }
  } catch (error) {
    console.error("Error deleting perfume:", error);
    alert("Failed to delete perfume");
  }
}

function goToPage(page) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", page);
  window.location.href = url.toString();
}

// ============================================
// BRANDS MANAGEMENT
// ============================================

function refreshBrands() {
  window.location.href = "/admin/dashboard?tab=brands";
}

function filterBrands() {
  const search = document.getElementById("brandSearch").value.toLowerCase();
  const rows = document.querySelectorAll("#brandsTableBody tr");

  rows.forEach((row) => {
    const name = row.dataset.brandName.toLowerCase();
    const matchesSearch = name.includes(search);

    row.style.display = matchesSearch ? "" : "none";
  });
}

function clearBrandFilters() {
  document.getElementById("brandSearch").value = "";
  filterBrands();
}

// ============================================
// BRAND MODAL FUNCTIONS
// ============================================

function openBrandDialog(brandId) {
  const modal = document.getElementById("brandModal");
  const title = document.getElementById("brandModalTitle");
  const submitBtn = document.getElementById("brandSubmitBtn");
  const form = document.getElementById("brandForm");
  const errorDiv = document.getElementById("brandModalError");

  // Reset form and error
  form.reset();
  errorDiv.style.display = "none";

  if (brandId) {
    // Edit mode
    title.textContent = "Edit Brand";
    submitBtn.querySelector(".btn-text").textContent = "Update";

    // Find brand data
    const brand = window.allBrandsData.find((b) => b._id === brandId);
    if (brand) {
      document.getElementById("brandId").value = brand._id;
      document.getElementById("brandName").value = brand.brandName;
    }
  } else {
    // Create mode
    title.textContent = "Add New Brand";
    submitBtn.querySelector(".btn-text").textContent = "Create";
    document.getElementById("brandId").value = "";
  }

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeBrandModal() {
  const modal = document.getElementById("brandModal");
  modal.style.display = "none";
  document.body.style.overflow = "";
}

async function submitBrandForm(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = document.getElementById("brandSubmitBtn");
  const errorDiv = document.getElementById("brandModalError");
  const brandId = document.getElementById("brandId").value;

  // Show loading
  submitBtn.disabled = true;
  submitBtn.querySelector(".btn-text").style.display = "none";
  submitBtn.querySelector(".btn-spinner").style.display = "inline-block";
  errorDiv.style.display = "none";

  try {
    const formData = {
      brandName: document.getElementById("brandName").value,
    };

    const token = getAuthToken();
    if (!token) {
      errorDiv.textContent =
        "Authentication required. Please refresh the page and login again.";
      errorDiv.style.display = "block";
      return;
    }

    const url = brandId ? `/api/brands/${brandId}` : "/api/brands";
    const method = brandId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      closeBrandModal();
      showSuccess(
        brandId
          ? `Brand "${formData.brandName}" updated successfully`
          : `Brand "${formData.brandName}" created successfully`
      );
      setTimeout(() => window.location.reload(), 1000);
    } else {
      const data = await response.json();
      errorDiv.textContent = data.message || "Failed to save brand";
      errorDiv.style.display = "block";
    }
  } catch (error) {
    console.error("Error saving brand:", error);
    errorDiv.textContent = "Failed to save brand";
    errorDiv.style.display = "block";
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector(".btn-text").style.display = "inline";
    submitBtn.querySelector(".btn-spinner").style.display = "none";
  }
}

function editBrand(id) {
  openBrandDialog(id);
}

async function deleteBrand(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) {
    return;
  }

  try {
    const token = getAuthToken();
    if (!token) {
      alert(
        "Authentication required. Please refresh the page and login again."
      );
      return;
    }

    const response = await fetch(`/api/brands/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      showSuccess(`Brand "${name}" deleted successfully`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      const data = await response.json();
      alert(data.message || "Failed to delete brand");
    }
  } catch (error) {
    console.error("Error deleting brand:", error);
    alert("Failed to delete brand");
  }
}

function goToBrandPage(page) {
  const url = new URL(window.location.href);
  url.searchParams.set("brandPage", page);
  url.searchParams.set("tab", "brands");
  window.location.href = url.toString();
}

// ============================================
// MEMBERS MANAGEMENT
// ============================================

function refreshMembers() {
  window.location.href = "/admin/dashboard?tab=members";
}

function filterMembers() {
  const search = document.getElementById("memberSearch").value.toLowerCase();
  const roleFilter = document.getElementById("memberRoleFilter").value;
  const genderFilter = document.getElementById("memberGenderFilter").value;

  const rows = document.querySelectorAll("#membersTableBody tr");
  rows.forEach((row) => {
    const name = row.dataset.memberName.toLowerCase();
    const email = row.dataset.memberEmail.toLowerCase();
    const role = row.dataset.memberRole;
    const gender = row.dataset.memberGender;

    const matchesSearch = name.includes(search) || email.includes(search);
    const matchesRole = !roleFilter || role === roleFilter;
    const matchesGender = !genderFilter || gender === genderFilter;

    if (matchesSearch && matchesRole && matchesGender) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function clearMemberFilters() {
  document.getElementById("memberSearch").value = "";
  document.getElementById("memberRoleFilter").value = "";
  document.getElementById("memberGenderFilter").value = "";
  filterMembers();
}

function goToMemberPage(page) {
  const url = new URL(window.location.href);
  url.searchParams.set("memberPage", page);
  url.searchParams.set("tab", "members");
  window.location.href = url.toString();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getAuthToken() {
  // First, try to get token from localStorage (React uses this)
  const localStorageToken = localStorage.getItem("token");
  if (localStorageToken) {
    console.log("Token found in localStorage");
    return localStorageToken;
  }

  // Fallback: Try to get token from cookie (EJS uses this)
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "token") {
      console.log("Token found in cookie");
      return value;
    }
  }

  // Debug: log both sources
  console.warn("Token not found!");
  console.warn("localStorage.token:", localStorage.getItem("token"));
  console.warn("document.cookie:", document.cookie);

  return null;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  // Check for tab parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get("tab");
  if (tab && ["perfumes", "brands", "members"].includes(tab)) {
    switchTab(tab);
  }
});
