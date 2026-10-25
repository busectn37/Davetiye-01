DİJİTAL DAVETİYE ALTYAPISI

DOSYALAR
- index.html: Sayfa yapısı
- css/invite.css: Renkler, yazı tipleri, zarf animasyonu ve mobil tasarım
- js/invite.js: Zarfı açma, hareketli çiçekler, müzik, geri sayım ve takvim bağlantısı
- data/event.json: Kolayca düzenleyebileceğin davetiye bilgileri
- assets/music.mp3: Kendi müzik dosyanı buraya ekleyebilirsin (assets klasörünü oluştur)

ÖNİZLEME
index.html dosyasını doğrudan açmak bazı tarayıcılarda data/event.json dosyasını yüklemeyebilir. En güvenlisi projeyi GitHub'a yükleyip GitHub Pages ile yayınlamak veya Replit gibi bir ortamda çalıştırmaktır.

KİŞİSELLEŞTİRME
GitHub'da data/event.json dosyasını açıp Edit (kalem) simgesine bas. İsim, tarih, saat, açıklama ve mekân bilgilerini değiştirip commit et.
Tarih biçimi: YYYY-AA-GG (ör. 2027-06-12)
Saat örneği: 19:00
Müzik için MP3 dosyanı assets/music.mp3 olarak ekle. Farklı dosya adı kullanırsan data/event.json içindeki musicUrl değerini değiştir.

GITHUB PAGES
1. Tüm dosyaları ve klasörleri depoya yükle (ZIP'i tek başına yükleme).
2. Repository > Settings > Pages bölümüne gir.
3. Deploy from a branch seç; branch olarak main ve klasör olarak /(root) seçip kaydet.
4. Birkaç dakika sonra verilen site bağlantısını aç.

NOT
Bu başlangıç şablonudur. Gerçek etkinlik bilgilerini kendin gir. Müzik, tarayıcı kısıtlamaları nedeniyle genellikle kullanıcı dokunduğunda başlar.
