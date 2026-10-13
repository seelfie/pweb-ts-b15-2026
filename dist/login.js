import { login, fetchRole } from "./lib/auth-api.js";
import { getSession, homePathFor, saveSession } from "./lib/session.js";
function getEl(id, ctor) {
    const el = document.getElementById(id);
    if (!(el instanceof ctor)) {
        throw new Error(`Elemen #${id} tidak ditemukan atau tipenya salah.`);
    }
    return el;
}
const form = getEl("login-form", HTMLFormElement);
const usernameInput = getEl("username", HTMLInputElement);
const passwordInput = getEl("password", HTMLInputElement);
const submitBtn = getEl("submit-btn", HTMLButtonElement);
const errorBox = getEl("error-message", HTMLDivElement);
function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
}
function hideError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
}
function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    usernameInput.disabled = isLoading;
    passwordInput.disabled = isLoading;
    submitBtn.textContent = isLoading ? "Memproses..." : "Masuk";
}
function describeError(err) {
    if (err instanceof TypeError) {
        return "Koneksi jaringan gagal. Periksa internet lalu coba lagi.";
    }
    if (err instanceof Error) {
        return err.message;
    }
    return "Terjadi kesalahan yang tidak dikenal.";
}
// Sudah login? Langsung arahkan.
const existing = getSession();
if (existing !== null) {
    window.location.href = homePathFor(existing.role);
}
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideError();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (username === "" || password === "") {
        showError("Username dan password wajib diisi.");
        return;
    }
    setLoading(true);
    try {
        const result = await login({ username, password });
        const role = await fetchRole(result.accessToken);
        saveSession({
            token: result.accessToken,
            role,
            firstName: result.firstName,
        });
        window.location.href = homePathFor(role);
    }
    catch (err) {
        showError(describeError(err));
        setLoading(false);
    }
});
