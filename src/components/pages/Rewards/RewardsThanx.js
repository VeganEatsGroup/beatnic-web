import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchCustomerThanx,
  resetCustomerThanx,
  selectCustomerThanx,
} from '@open-tender/redux'

import RewardsProgram from './RewardsProgam'
import { Loading } from '../..'

const RewardsThanx = () => {
  const dispatch = useDispatch()
  const { thanx, loading, error } = useSelector(selectCustomerThanx)
  const { progress, rewards } = thanx || {}
  const hasRewards = rewards && rewards.length > 0
  const program = {
    name: 'Rewards',
    progress: progress ? parseInt(progress.percentage) : null,
    reward: progress ? progress.towards : null,
  }

  useEffect(() => {
    dispatch(fetchCustomerThanx())
    return () => dispatch(resetCustomerThanx())
  }, [dispatch])

  return (
    <>
      {thanx ? (
        <>
          <RewardsProgram program={program} />
          {hasRewards && (
            <>
              <div
                className="loyalty__program__header"
                style={{ margin: '3rem 0 0' }}
              >
                <p className="ot-heading ot-font-size-h5">Your Rewards</p>
                <p className="ot-font-size-small">
                  You'll have the opportunity to redeem these on the checkout
                  page.
                </p>
              </div>
              <div className="loyalty__program__rewards">
                {rewards.map((reward) => {
                  return (
                    <div
                      key={reward.ext_id}
                      className="loyalty__program__reward"
                    >
                      <div className="loyalty__program__reward__container ot-bg-color-secondary">
                        <p className="ot-color-headings">{reward.name}</p>
                        {reward.description && (
                          <p className="ot-font-size-small">
                            {reward.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      ) : loading === 'pending' ? (
        <Loading text="Retrieving your rewards..." />
      ) : error ? (
        <p>
          Something appears to have gone wrong. Please try logging out and
          logging back in again.
        </p>
      ) : (
        <p>Looks like you don't have any rewards yet.</p>
      )}
    </>
  )
}

RewardsThanx.displayName = 'RewardsThanx'
export default RewardsThanx
