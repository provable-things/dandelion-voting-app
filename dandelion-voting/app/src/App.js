import React, { useCallback } from 'react'
import {
  Button,
  Header,
  IconPlus,
  Main,
  SyncIndicator,
  GU,
  useLayout
} from '@aragon/ui'
import NewVotePanel from './components/NewVotePanel'
import useFilterVotes from './hooks/useFilterVotes'
import useScrollTop from './hooks/useScrollTop'
import NoVotes from './screens/NoVotes'
import VoteDetail from './screens/VoteDetail'
import Votes from './screens/Votes'
import { AppLogicProvider, useAppLogic } from './app-logic'
import { IdentityProvider } from './identity-manager'
import { SettingsProvider } from './vote-settings-manager'

const App = React.memo(function App() {
  const {
    actions,
    executionTargets,
    isSyncing,
    newVotePanel,
    selectedVote,
    selectVote,
    votes,
    lastTimeVotedYes
  } = useAppLogic()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  const handleBack = useCallback(() => selectVote(-1), [selectVote])
  const {
    filteredVotes,
    voteStatusFilter,
    handleVoteStatusFilterChange,
    voteOutcomeFilter,
    handleVoteOutcomeFilterChange,
    voteTrendFilter,
    handleVoteTrendFilterChange,
    voteAppFilter,
    handleVoteAppFilterChange,
    voteDateRangeFilter,
    handleVoteDateRangeFilterChange,
    handleClearFilters
  } = useFilterVotes(votes, executionTargets)

  useScrollTop(selectedVote)

  return (
    <React.Fragment>
      <SyncIndicator visible={isSyncing} />
      {!votes.length && (
        <div
          css={`
            height: calc(100vh - ${8 * GU}px);
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <NoVotes onNewVote={newVotePanel.requestOpen} isSyncing={isSyncing} />
        </div>
      )}
      {!!votes.length && (
        <React.Fragment>
          <Header
            primary='Voting'
            secondary={
              !selectedVote && (
                <Button
                  mode='strong'
                  onClick={newVotePanel.requestOpen}
                  label='New vote'
                  icon={<IconPlus />}
                  display={compactMode ? 'icon' : 'label'}
                />
              )
            }
          />
          {selectedVote ? (
            <VoteDetail
              vote={selectedVote}
              onBack={handleBack}
              onVote={actions.vote}
              onExecute={actions.execute}
            />
          ) : (
            <Votes
              votes={votes}
              selectVote={selectVote}
              executionTargets={executionTargets}
              filteredVotes={filteredVotes}
              voteStatusFilter={voteStatusFilter}
              handleVoteStatusFilterChange={handleVoteStatusFilterChange}
              voteOutcomeFilter={voteOutcomeFilter}
              handleVoteOutcomeFilterChange={handleVoteOutcomeFilterChange}
              voteTrendFilter={voteTrendFilter}
              handleVoteTrendFilterChange={handleVoteTrendFilterChange}
              voteAppFilter={voteAppFilter}
              handleVoteAppFilterChange={handleVoteAppFilterChange}
              voteDateRangeFilter={voteDateRangeFilter}
              handleVoteDateRangeFilterChange={handleVoteDateRangeFilterChange}
              handleClearFilters={handleClearFilters}
              lastTimeVotedYes={lastTimeVotedYes}
            />
          )}
        </React.Fragment>
      )}
      <NewVotePanel
        onCreateVote={actions.createVote}
        panelState={newVotePanel}
      />
    </React.Fragment>
  )
})

export default function Voting() {
  return (
    <Main assetsUrl='./aragon-ui'>
      <AppLogicProvider>
        <IdentityProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </IdentityProvider>
      </AppLogicProvider>
    </Main>
  )
}
