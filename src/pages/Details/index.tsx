import React, { useEffect, useRef, useState } from 'react'
import {
  IonButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import { useIonRouter } from '@ionic/react'
import { DogProps } from '../../props'

const Details: React.FC = () => {
  const doOnce = useRef(false)
  const router = useIonRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [dogs, setDogs] = useState<DogProps[]>()

  const params = new URLSearchParams(router.routeInfo.search)

  const getImages = async () => {
    const calls = params.getAll('dog').map((id) =>
      fetch(`https://api.thedogapi.com/v1/images/${id}`)
        .then((r) => r.json())
        .catch(() => ({}))
    )

    await Promise.all(calls).then((values) => setDogs(values))
  }

  useEffect(() => {
    if (isLoading) {
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
          <IonTitle class='ion-text-center'>Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large' class='ion-text-center'>
              Details
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <p className='ion-text-center'>
          {params.get('name')}, here are your favourites
        </p>

        {isLoading && (
          <IonGrid>
            <IonRow class='ion-align-items-center ion-justify-content-center list-height'>
              <IonSpinner />
            </IonRow>
          </IonGrid>
        )}

        {!isLoading && (
          <div className='list'>
            {dogs?.map((dog) => (
              <div key={dog.id} className='list-item'>
                <img
                  src='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
                  style={{ backgroundImage: `url(${dog.url})` }}
                  alt='dog image'
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !dogs?.length && (
          <p className='ion-text-center'>
            {params.get('name')} you did not choose any dogs!
          </p>
        )}

        <IonGrid>
          <IonRow class='ion-justify-content-center'>
            <IonButton routerLink='/'>Reset</IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default Details
