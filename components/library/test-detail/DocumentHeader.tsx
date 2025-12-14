'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface DocumentHeaderProps {
  title: string;
  authors: string
  summary: string;
}
const DocumentHeader = ({
  title,
  authors,
  summary,
}: DocumentHeaderProps) => {
  // This is a Server Component.
  return (
    <header className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-4">
        {title}
      </h1>
      <div className="flex items-center space-x-4 mb-6">
        {authors.map((author) => (
          <div key={author.id} className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={author.avatarUrl} alt={author.name} />
              <AvatarFallback>
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Link
              href={author.profileUrl}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50"
            >
              {author.name}
            </Link>
          </div>
        ))}
      </div>
      <Card className="bg-gray-50 dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {t.summary}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {summary}
          </p>
        </CardContent>
      </Card>
    </header>
  );
};