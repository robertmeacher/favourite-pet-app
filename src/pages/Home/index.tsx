import React, { useEffect, useRef, useState } from 'react'
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonRow,
  IonGrid
} from '@ionic/react'
import { DogProps } from '../../props'

const Home: React.FC = () => {
  const doOnce = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dogs, setDogs] = useState<DogProps[]>()

  const getImages = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const data = await fetch(
      'https://api.thedogapi.com/v1/images/search?limit=10'
    )
      .then((r) => r.json())
      .catch(() => [])

    setDogs(data)
  }

  useEffect(() => {
    if (isLoading && typeof dogs !== 'undefined') {
      setIsLoading(false)
    }
  }, [dogs])

  useEffect(() => {
    if (doOnce.current) return

    doOnce.current = true

    getImages()
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class='ion-text-center'>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen class='ion-padding'>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large' class='ion-text-center'>
              Home
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        {isLoading && (
          <IonGrid class='full-height'>
            <IonRow class='ion-align-items-center ion-justify-content-center full-height'>
              <IonSpinner />
            </IonRow>
          </IonGrid>
        )}

        {!isLoading && (
          <form method='get' action='/details'>
            <div className='input-container'>
              <IonInput
                name='name'
                label="What's your name?"
                fill='outline'
                label-placement='stacked'
                required
              ></IonInput>
            </div>

            <p className='ion-text-center'>Select your favourite dogs</p>

            <div className='list'>
              {dogs?.map((dog) => (
                <div key={dog.id} className='list-item'>
                  <input
                    type='checkbox'
                    id={`dog-image-${dog.id}`}
                    name='dog'
                    value={dog.id}
                  />
                  <label aria-label='dog' htmlFor={`dog-image-${dog.id}`}>
                    <img
                      src='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
                      style={{ backgroundImage: `url(${dog.url})` }}
                      alt='dog image'
                    />
                  </label>
                </div>
              ))}
            </div>

            <IonGrid>
              <IonRow class='ion-justify-content-center'>
                <IonButton size='large' type='submit'>
                  Submit
                </IonButton>
              </IonRow>
            </IonGrid>
          </form>
        )}
      </IonContent>
    </IonPage>
  )
}

export default Home
