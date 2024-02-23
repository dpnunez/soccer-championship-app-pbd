'use client'

import { Avatar } from '@/components/ui'
import { cn } from '@/lib/utils'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { Pencil1Icon } from '@radix-ui/react-icons'

const AvatarPicker = ({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) => {
  return (
    <div className="relative group cursor-pointer">
      <Avatar {...rest} className={cn(className, '')}>
        {children}
      </Avatar>
      <div className="rounded-full w-full h-full bg-slate-600 absolute top-0 group-hover:opacity-50 opacity-0 flex items-center transition-all">
        <Pencil1Icon className="mx-auto" color="white" />
      </div>
    </div>
  )
}

export { AvatarPicker }
