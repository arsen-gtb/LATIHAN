// 1. Impor modul Firebase dari CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. Tempel konfigurasi Firebase Anda di sini
const firebaseConfig = {
    apiKey: "AIzaSyAozP7MWzMBXfN2GMfL0S8yhLiOlYbYr0M",
    authDomain: "latihan-52a7c.firebaseapp.com",
    projectId: "latihan-52a7c",
    storageBucket: "latihan-52a7c.firebasestorage.app",
    messagingSenderId: "205629414785",
    appId: "1:205629414785:web:4262746d5592765922dc80"
};

// 3. Inisialisasi Aplikasi & Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referensi ke koleksi (tabel) bernama 'pemantauan'
const referensiData = collection(db, "pemantauan");

// 4. Tangkap elemen DOM
const inputData = document.getElementById("inputData");
const btnSimpan = document.getElementById("btnSimpan");
const daftarData = document.getElementById("daftarData");

// 5. Fungsi MENYIMPAN data (Write)
btnSimpan.addEventListener("click", async () => {
    const teks = inputData.value.trim();
    if (teks !== "") {
        try {
            await addDoc(referensiData, {
                deskripsi: teks,
                waktu_input: serverTimestamp() // Mencatat waktu standar server
            });
            inputData.value = ""; // Kosongkan form setelah berhasil
        } catch (error) {
            console.error("Gagal menyimpan data: ", error);
        }
    }
});

// 6. Fungsi REAL-TIME LISTENER (Read & Sinkronisasi)
// Mengurutkan data berdasarkan waktu input terbaru
const q = query(referensiData, orderBy("waktu_input", "desc"));

// onSnapshot akan terpicu otomatis setiap kali ada perubahan data di server
onSnapshot(q, (snapshot) => {
    daftarData.innerHTML = ""; // Bersihkan daftar sebelum render ulang
    snapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement("li");
        
        // Cek jika waktu_input sudah ada (menghindari error latency lokal)
        const waktu = data.waktu_input ? data.waktu_input.toDate().toLocaleTimeString('id-ID') : 'Mengirim...';
        
        li.textContent = `[${waktu}] ${data.deskripsi}`;
        daftarData.appendChild(li);
    });
});
