document.addEventListener("alpine:init", () => {
  Alpine.data("product", () => ({
    items: [
      {
        id: 1,
        name: "Chicken Katsu",
        img: "Katsu_best.png",
        price: 17000,
      },
      {
        id: 2,
        name: "Japanese Egg Roll",
        img: "pngfind.com-rolling-eyes-emoji-png-2800479.png",
        price: 15000,
      },
      {
        id: 3,
        name: "Karage",
        img: "karage-removebg-preview.png",
        price: 13000,
      },
      {
        id: 4,
        name: "French Fries",
        img: "french-removebg-preview_1.png",
        price: 12000,
      },
      {
        id: 5,
        name: "Pop Mie",
        img: "popmie-removebg-preview.png",
        price: 8000,
      },
      {
        id: 6,
        name: "Beng-Beng Drink",
        img: "1693042098696583403-removebg-preview.png",
        price: 7000,
      },
      {
        id: 7,
        name: "Le Minerale",
        img: "Le-minerale.png",
        price: 5000,
      },
      {
        id: 8,
        name: "Teh Pucuk Harum",
        img: "pucuk.png",
        price: 4000,
      },
      {
        id: 9,
        name: "Nutri Sari",
        img: "nutri-removebg-preview.png",
        price: 5000,
      },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada / cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
        alert("Barang sudah ditambahkan");
      } else {
        // Jika barangnya sudah ada, cek apakah barangnya sama ataubeda pada cart
        this.items = this.items.map((item) => {
          // jika barng berbeda
          if (item.id !== newItem.id) {
            return item;
            alert("Barang sudah ditambahkan");
          } else {
            // jika barang sudah ada, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang mau diremove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1 1

        this.items = this.items.map((item) => {
          // jika bukan barang yang diklik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validation
const checkoutButton = document.querySelector("#checkout-button");
const form = document.querySelector("#checkoutForm");
// checkoutButton.disabled = true;

// konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  // const message = formatMessage(objData);
  // window.open("http://wa.me/6285779912482?text=" + encodeURIComponent(message));

  // minta transaction token menggunakan ajax atau fetch
  try {
    const response = await fetch("php/placeOrder.php", {
      method: "POST",
      body: data,
    });
    const token = await response.text();
    console.log(token);
    // window.snap.pay(token);
  } catch (err) {
    console.log(err.message);
  }
});

// Format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer
  Nama : ${obj.name}
  Alamat : ${obj.alamat}
  Nomor_HP : ${obj.nomerhp}
  Pilihan : ${obj.pilihan}
Data Pesanan
  ${JSON.parse(obj.items).map(
    (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
  )}
  TOTAL: ${rupiah(obj.total)}
  Terima Kasih.`;
};
