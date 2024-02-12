'use client'

import { TeamEmblem } from '@/components/TeamEmblem'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui'
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface AccountInfo {
  username: string
  password: string
}

export default function CreateTeamPage() {
  const form = useForm()
  const router = useRouter()
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [openAccountDialog, setOpenAccountDialog] = useState(false)

  const emblem = form.watch('emblem')

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const {
        data: { owner },
      } = await api.post('/api/team', data)
      const _account: AccountInfo = {
        username: owner.username,
        password: owner.password,
      }
      setAccountInfo(_account)
      setOpenAccountDialog(true)
      form.reset()
    } catch (err) {
      console.log('erro', err)
    }
  })

  const isLinkRegex = /^(http|https):\/\/[^ "]+$/
  const isValidLink = isLinkRegex.test(emblem)

  const onCloseModal = () => {
    setOpenAccountDialog(false)
    router.push('/admin')
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <h1 className="text-3xl font-bold mb-10">Cadastrar Time</h1>
        <div className="flex gap-4">
          <div className="flex flex-col flex-[4] justify-between mr-11">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do time</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emblem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link para emblema do time</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Criar Time</Button>
          </div>
          <div className="overflow-hidden flex-1 ring-slate-200 ring-1 rounded-lg">
            <TeamEmblem
              emblem={isValidLink && emblem}
              className="flex-1 aspect-square"
            />
          </div>
        </div>
      </form>
      <InfoDialog
        handleClose={onCloseModal}
        username={accountInfo?.username}
        tempPassword={accountInfo?.password}
        open={openAccountDialog}
      />
    </Form>
  )
}

interface InfoDialogProps {
  username?: string
  tempPassword?: string
  open?: boolean
  handleClose?: () => void
}

const InfoDialog = ({
  username,
  tempPassword,
  open,
  handleClose,
}: InfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogClose onClick={handleClose} />
          <DialogTitle>Time criado com sucesso</DialogTitle>
          <DialogDescription>
            A seguir você terá acesso as informações da conta para acessar o
            time
          </DialogDescription>
        </DialogHeader>
        <div>
          <p>username: {username}</p>
          <p>password: {tempPassword}</p>
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
