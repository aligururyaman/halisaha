"use client";

import Image from "next/image";
import saha from "./image/saha.jpg";
import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import sagForma from "./image/2.png";
import solForma from "./image/5.png";

type Oyuncu = {
  isim: string;
  pozisyon: string;
};

type Takim = {
  sag: { isim: string; bip: boolean }[];
  sol: { isim: string; bip: boolean }[];
};

export default function Home() {
  const [oyuncuismi, setOyuncuismi] = useState("");
  const [oyuncu, setOyuncu] = useState<Oyuncu[]>([]);
  const [pozisyon, setPozisyon] = useState("");
  const [takim, setTakim] = useState<Takim>({ sag: [], sol: [] });
  const [geriSayim, setGeriSayim] = useState<number | null>(null);
  const [bipDurumu, setBipDurumu] = useState({ sag: false, sol: false });

  const ekle = () => {
    if (oyuncuismi && pozisyon) {
      setOyuncu([...oyuncu, { isim: oyuncuismi, pozisyon }]);
      setOyuncuismi("");
      setPozisyon("");
    }
  };

  const kaldir = (index: number) => {
    setOyuncu(oyuncu.filter((_, i) => i !== index));
  };

  const takimKur = () => {
    setGeriSayim(10);
  };

  useEffect(() => {
    if (geriSayim !== null) {
      if (geriSayim > 0) {
        const timer = setTimeout(() => setGeriSayim(geriSayim - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGeriSayim(null);
        atamaYap();
      }
    }
  }, [geriSayim]);

  const atamaYap = () => {
    const pozisyonlar = ["Forvet", "Kanat", "Merkez", "Defans"];
    const yeniTakim: Takim = { sag: [], sol: [] };

    pozisyonlar.forEach((pozisyon) => {
      const oyuncular = oyuncu.filter((o) => o.pozisyon === pozisyon);
      const shuffledOyuncu = [...oyuncular].sort(() => 0.5 - Math.random());

      shuffledOyuncu.forEach((o, i) => {
        const bip = Math.random() > 0.5; // Random BİP durumu
        if (i % 2 === 0) {
          yeniTakim.sag.push({ isim: o.isim, bip });
        } else {
          yeniTakim.sol.push({ isim: o.isim, bip });
        }
      });
    });

    setTakim(yeniTakim);
    setBipDurumu({
      sag: Math.random() > 0.5,
      sol: Math.random() > 0.5,
    });
  };

  return (
    <main className="relative">
      <div className="flex justify-around min-h-screen">
        <div className="relative">
          <Image
            src={saha}
            alt="saha"
            width={500}
            height={400}
            className="rounded-2xl"
          />
          {takim.sol.map((oyuncu, index) => (
            <Draggable key={index}>
              <div
                className="absolute text-white bg-black bg-opacity-50 p-2 rounded"
                style={{ top: `${20 + index * 40}px`, left: "10px" }}
              >
                <Image src={solForma} alt="forma" height={50} width={50} />
                {oyuncu.isim}
              </div>
            </Draggable>
          ))}
          {bipDurumu.sol !== null && (
            <div className="absolute top-[55rem] left-52 text-3xl m-4 text-white bg-black bg-opacity-50 p-2 rounded">
              {bipDurumu.sol ? "BİP GİYİYOR" : "BİP GİYMİYOR"}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-10">
          <div>
            <h1 className="text-2xl font-bold">Oyuncular</h1>
          </div>
          <div>
            <input
              placeholder="Oyuncu adı"
              className="h-14 w-60 text-black text-xl font-bold"
              value={oyuncuismi}
              onChange={(e) => setOyuncuismi(e.target.value)}
            />
          </div>
          <div>
            <select
              className="h-14 w-60 text-black text-xl font-bold"
              value={pozisyon}
              onChange={(e) => setPozisyon(e.target.value)}
            >
              <option value="" disabled>
                Pozisyon Seçin
              </option>
              <option value="Forvet">Forvet</option>
              <option value="Kanat">Kanat</option>
              <option value="Merkez">Merkez</option>
              <option value="Defans">Defans</option>
            </select>
          </div>
          <div>
            <button
              className="bg-red-500 font-bold h-20 w-60 text-3xl rounded-2xl shadow-md shadow-gray-500 hover:bg-red-600 transition duration-200"
              onClick={ekle}
            >
              Ekle
            </button>
          </div>
          <div>
            <button
              className="bg-green-500 font-bold  h-20 w-60 text-3xl rounded-2xl shadow-md shadow-gray-500 hover:bg-green-600 transition duration-200"
              onClick={takimKur}
            >
              Takım Kur
            </button>
          </div>
          <div>
            {["Forvet", "Kanat", "Merkez", "Defans"].map((pos) => (
              <div key={pos} className="mb-6">
                <h2 className="text-xl font-bold">
                  {pos.charAt(0).toUpperCase() + pos.slice(1)}
                </h2>
                <ul>
                  {oyuncu
                    .filter((o) => o.pozisyon === pos)
                    .map((o, index) => (
                      <li
                        key={index}
                        className="text-2xl flex justify-between items-center mb-5 gap-10 "
                      >
                        {o.isim}
                        <button
                          className="bg-red-500 text-white h-8 w-20 ml-4 rounded shadow hover:bg-red-600 transition duration-200"
                          onClick={() => kaldir(index)}
                        >
                          Kaldır
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <Image
            src={saha}
            alt="saha"
            width={500}
            height={400}
            className="rounded-2xl"
          />
          {takim.sag.map((oyuncu, index) => (
            <Draggable key={index}>
              <div
                className="absolute text-white bg-black bg-opacity-50 p-2"
                style={{ top: `${20 + index * 40}px`, right: "10px" }}
              >
                <Image src={sagForma} alt="forma" height={50} width={50} />
                {oyuncu.isim}
              </div>
            </Draggable>
          ))}
          {bipDurumu.sag !== null && (
            <div className="absolute top-[55rem] right-52 text-3xl m-4 text-white bg-black bg-opacity-50 p-2 rounded">
              {bipDurumu.sag ? "BİP GİYİYOR" : "BİP GİYMİYOR"}
            </div>
          )}
        </div>
      </div>
      {geriSayim !== null && (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-75">
          <div className="text-[20rem] font-bold text-red-500">{geriSayim}</div>
        </div>
      )}
    </main>
  );
}
