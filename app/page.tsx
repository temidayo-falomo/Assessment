"use client";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface Character {
  name: string;
  height: string;
  birth_year: string;
}

const debounce = <T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default function Home() {
  const SWAPI_URL = "https://swapi.dev/api/people";

  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { toast } = useToast();

  const fetchCharacters = async (searchQ: string) => {
    setIsLoading(true);
    const response = await fetch(`${SWAPI_URL}?search=${searchQ}`);
    const data = await response.json();
    setCharacters(data.results);
    setIsLoading(false);
  };

  const handleSearch = useCallback(
    debounce((search: string) => fetchCharacters(search), 500),
    []
  );

  useEffect(() => {
    fetchCharacters("").catch(() => {
      //
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    });
  }, []);

  return (
    <div className="">
      <div className="max-w-screen-xl mt-12 mx-auto">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-5xl font-semibold text-center">
            Star Wars Characters
          </h1>
          <p className="text-center text-sm md:text-base mt-4 text-gray-500">
            A list of Star Wars characters from the SWAPI.
          </p>
          <Input
            type="search"
            placeholder="Search..."
            className="mt-4 w-[300px] mx-auto"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
          />
        </div>

        <div className="my-10 px-12 mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Height</TableHead>
                <TableHead className="text-right">Birth Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="w-[200px] h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-[200px] h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-[200px] h-5 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {!isLoading && characters.length > 0 && (
                <>
                  {characters?.map((data, index) => (
                    <TableRow
                      key={index}
                      className="border-gray-100 text-gray-700"
                    >
                      <TableCell className="font-medium">{data.name}</TableCell>
                      <TableCell>{data.height}</TableCell>
                      <TableCell className="text-right">
                        {data.birth_year === "unknown"
                          ? "N/A"
                          : data.birth_year}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {!isLoading && characters.length === 0 && (
                <TableRow className="h-40 hover:bg-transparent">
                  <TableCell colSpan={3} className="text-center text-gray-600">
                    No characters found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
