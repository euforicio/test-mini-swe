import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { TodoProvider } from '../../context/TodoContext'
import { AddTask } from '../AddTask'
import { TodoList } from '../TodoList'

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <TodoProvider>{children}</TodoProvider>

it('adds a task via AddTask', async () => {
  const user = userEvent.setup()
  render(
    <Wrapper>
      <AddTask />
      <TodoList />
    </Wrapper>
  )
  const input = screen.getByLabelText(/new task/i)
  await user.type(input, 'Test Task{enter}')
  expect(await screen.findByText('Test Task')).toBeInTheDocument()
})
