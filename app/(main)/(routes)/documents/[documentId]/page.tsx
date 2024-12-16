'use client'

import { useMutation, useQuery } from "convex/react"
import dynamic from "next/dynamic"
import { useMemo, useEffect, useState } from "react"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Toolbar } from "@/components/Toolbar"
import { Cover } from "@/components/Cover"
import { Skeleton } from "@/components/ui/skeleton"

export default function DocumentIdPage({ 
  params 
}: { 
  params: Promise<{ documentId: string }> 
}) {
  const [documentId, setDocumentId] = useState<Id<'documents'> | null>(null)

  useEffect(() => {
    params.then((resolvedParams) => {
      // Convert string to Id
      setDocumentId(resolvedParams.documentId as Id<'documents'>)
    })
  }, [params])

  const Editor = useMemo(
    () => dynamic(() => import("@/components/Editor"), { ssr: false }),
    []
  )

  // Use type assertion or type guard
  const document = useQuery(api.documents.getById, 
    documentId ? { documentId } : 'skip'
  )

  const update = useMutation(api.documents.update)

  const onChange = (content: string) => {
    if (documentId) {
      update({
        id: documentId,
        content,
      })
    }
  }

  // Loading state when documentId is not yet resolved
  if (!documentId) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-14 w-[80%]" />
            <Skeleton className="h-14 w-[40%]" />
            <Skeleton className="h-14 w-[60%]" />
          </div>
        </div>
      </div>
    )
  }

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-14 w-[80%]" />
            <Skeleton className="h-14 w-[40%]" />
            <Skeleton className="h-14 w-[60%]" />
          </div>
        </div>
      </div>
    )
  }

  if (document === null) {
    return <div>Not Found</div>
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} editable={true} />
      </div>
    </div>
  )
}