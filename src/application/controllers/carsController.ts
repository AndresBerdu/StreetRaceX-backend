import type { Request, Response } from "express";
import {
  getDoc,
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../architecture/firebase/firebase.ts";
import { CarSchema } from "../../architecture/adapters/schemas/carSchema.ts";

interface Car {
  id: string;
  type_vehicle: string;
  brand: string;
  model: string;
  created_year: string;
  color: string;
  plate: string;
  photo: string;
  modifications: string;
  active: boolean;
  created_at: Date;
}

export const getCars = async (req: Request, res: Response) => {
  try {
    const snapshot = await getDocs(collection(db, "cars"));

    if (snapshot.empty) {
      res.status(200).json({
        ok: true,
        data: [],
        message: "no hay ningún vehiculo registrasdo",
      });
    }

    const cars: Car[] = [];

    snapshot.forEach((doc) => {
      cars.push({
        id: doc.id,
        ...doc.data(),
      } as Car);
    });

    res.status(200).json({
      ok: true,
      data: cars,
      message: "se han encontrado los siguientes autos",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

export const getCar = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const docRef = doc(db, "cars", id as string);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      res.status(200).json({
        ok: true,
        data: snapshot.data(),
        message: `auto obtenido`,
      });
    }

    res.status(404).json({
      ok: false,
      error: `auto no encontrado con el id: ${id}`,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: `internal server error`,
    });
  }
};

export const createCar = async (req: Request, res: Response) => {
  const {
    type_vehicle,
    brand,
    model,
    created_year,
    color,
    plate,
    photo,
    modifications,
  } = req.body;

  try {
    const docRef = await addDoc(collection(db, "cars"), {
      type_vehicle,
      brand,
      model,
      created_year,
      color,
      plate,
      photo,
      modifications,
      active: false,
      created_at: new Date(),
    });

    const snapshot = await getDoc(docRef);

    res.status(201).json({
      ok: true,
      data: {
        id: docRef.id,
        ...snapshot.data(),
        active: false,
        created_at: new Date(),
      },
      message: "new car created",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        ok: false,
        data: error.message,
      });
    }
  }
};

export const updateFieldCar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const docRef = doc(db, "cars", id as string);
    await updateDoc(docRef, {
      ...body,
    });

    const snapshot = await getDoc(docRef);

    res.status(200).json({
      ok: true,
      data: snapshot.data(),
      message: "vehiculo actualizado",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        ok: false,
        data: error.message,
      });
    }
  }
};

export const deleteCar = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const docRef = doc(db, "cars", id as string);
    await deleteDoc(docRef);

    res.status(204).json({});
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        ok: false,
        data: error.message,
      });
    }
  }
};
